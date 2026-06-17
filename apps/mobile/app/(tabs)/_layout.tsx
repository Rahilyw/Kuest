import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '@/lib/constants'

type IoniconsName = React.ComponentProps<typeof Ionicons>['name']

function tabIcon(filledName: IoniconsName, outlineName: IoniconsName) {
  return ({ focused, color }: { focused: boolean; color: string }) => (
    <Ionicons name={focused ? filledName : outlineName} size={24} color={color} />
  )
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.bg,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          height: 64,
          paddingBottom: 8,
          paddingTop: 4,
        },
        tabBarActiveTintColor: COLORS.accent,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarLabelStyle: { fontWeight: '600' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Quests',
          tabBarIcon: tabIcon('map', 'map-outline'),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Map',
          tabBarIcon: tabIcon('location', 'location-outline'),
        }}
      />
      <Tabs.Screen
        name="leaderboard"
        options={{
          title: 'Ranks',
          tabBarIcon: tabIcon('trophy', 'trophy-outline'),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: tabIcon('person', 'person-outline'),
        }}
      />
    </Tabs>
  )
}
