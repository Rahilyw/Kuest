import AsyncStorage from '@react-native-async-storage/async-storage'
import { CITY } from './constants'

export const ONBOARDING_COMPLETE_KEY = 'onboarding_complete'
export const ONBOARDING_CITY_KEY = 'onboarding_city'

export const PILOT_CITIES = [CITY.name] as const

export async function hasCompletedOnboarding(): Promise<boolean> {
  const value = await AsyncStorage.getItem(ONBOARDING_COMPLETE_KEY)
  return value === 'true'
}

export async function getOnboardingCity(): Promise<string> {
  const saved = await AsyncStorage.getItem(ONBOARDING_CITY_KEY)
  return saved ?? CITY.name
}

export async function completeOnboarding(city: string = CITY.name): Promise<void> {
  await AsyncStorage.multiSet([
    [ONBOARDING_COMPLETE_KEY, 'true'],
    [ONBOARDING_CITY_KEY, city],
  ])
}
