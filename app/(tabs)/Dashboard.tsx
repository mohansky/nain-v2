// app/(tabs)/Dashboard.tsx
import React, { useState, useEffect } from 'react'
import { ScrollView, View, Text, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/useAuth'
import { ChildWithRelationship, ChildMeasurement } from '@/types'
import {
  ChildTabs,
  ChildHeader,
  LatestMeasurements,
  QuickActions,
  EditProfileModal,
  AddMeasurementsModal
} from '@/components/ChildProfile'

const DashboardScreen = () => {
  const { session } = useAuth()
  const [children, setChildren] = useState<ChildWithRelationship[]>([])
  const [selectedChildIndex, setSelectedChildIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [latestMeasurements, setLatestMeasurements] = useState<ChildMeasurement | null>(null)
  
  // Modal states
  const [showEditModal, setShowEditModal] = useState(false)
  const [showMeasurementsModal, setShowMeasurementsModal] = useState(false)

  useEffect(() => {
    if (session) {
      fetchChildren()
    }
  }, [session])

  useEffect(() => {
    if (children.length > 0 && children[selectedChildIndex]) {
      fetchLatestMeasurements(children[selectedChildIndex].id)
    }
  }, [selectedChildIndex, children])

  async function fetchChildren() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('user_children')
        .select(`
          *,
          child_profiles (
            id,
            name,
            avatar_url,
            date_of_birth,
            gender,
            created_at,
            updated_at
          )
        `)
        .eq('user_id', session?.user?.id)

      if (error) throw error

      const childrenWithRelationship: ChildWithRelationship[] = data?.map(relation => ({
        ...relation.child_profiles,
        user_relationship: relation
      })) || []

      setChildren(childrenWithRelationship)
    } catch (error) {
      console.error('Error fetching children:', error)
      Alert.alert('Error', 'Failed to load children')
    } finally {
      setLoading(false)
    }
  }

  async function fetchLatestMeasurements(childId: string) {
    try {
      const { data, error } = await supabase
        .from('child_measurements')
        .select('*')
        .eq('child_id', childId)
        .order('measured_at', { ascending: false })
        .limit(1)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        console.log('Measurements table might not exist yet:', error)
        setLatestMeasurements(null)
        return
      }

      setLatestMeasurements(data || null)
    } catch (error) {
      console.error('Error fetching measurements:', error)
      setLatestMeasurements(null)
    }
  }

  const handleSelectChild = (index: number) => {
    setSelectedChildIndex(index)
  }

  const handleEditProfile = () => {
    setShowEditModal(true)
  }

  const handleAddMeasurement = () => {
    setShowMeasurementsModal(true)
  }

  const handleViewGrowthChart = () => {
    // TODO: Implement growth chart functionality
    Alert.alert('Coming Soon', 'Growth chart feature will be available soon!')
  }

  const handleEditSuccess = () => {
    fetchChildren() // Refresh children data
  }

  const handleMeasurementSuccess = () => {
    if (children[selectedChildIndex]) {
      fetchLatestMeasurements(children[selectedChildIndex].id) // Refresh measurements
    }
  }

  const closeEditModal = () => {
    setShowEditModal(false)
  }

  const closeMeasurementsModal = () => {
    setShowMeasurementsModal(false)
  }

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 justify-center items-center">
          <Text className="text-lg text-muted-foreground">Loading...</Text>
        </View>
      </SafeAreaView>
    )
  }

  if (children.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 justify-center items-center p-6">
          <Text className="text-2xl font-bold text-foreground mb-4 text-center">
            No Children Added
          </Text>
          <Text className="text-lg text-muted-foreground text-center">
            Go to the Home tab to add your first child
          </Text>
        </View>
      </SafeAreaView>
    )
  }

  const selectedChild = children[selectedChildIndex]

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1">
        {/* Child Tabs */}
        <ChildTabs
          children={children}
          selectedChildIndex={selectedChildIndex}
          onSelectChild={handleSelectChild}
        />

        {/* Child Details */}
        <View className="p-6">
          {/* Child Header */}
          <ChildHeader child={selectedChild} />

          {/* Latest Measurements */}
          <LatestMeasurements
            measurements={latestMeasurements}
            onAddMeasurement={handleAddMeasurement}
          />

          {/* Quick Actions */}
          <QuickActions
            onAddMeasurement={handleAddMeasurement}
            onEditProfile={handleEditProfile}
            onViewGrowthChart={handleViewGrowthChart}
          />
        </View>

        {/* Modals */}
        <EditProfileModal
          visible={showEditModal}
          child={selectedChild}
          onClose={closeEditModal}
          onSuccess={handleEditSuccess}
        />

        <AddMeasurementsModal
          visible={showMeasurementsModal}
          child={selectedChild}
          onClose={closeMeasurementsModal}
          onSuccess={handleMeasurementSuccess}
        />
      </ScrollView>
    </SafeAreaView>
  )
}

export default DashboardScreen