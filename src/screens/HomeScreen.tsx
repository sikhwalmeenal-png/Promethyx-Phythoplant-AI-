import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { usePlantData } from '../hooks/usePlantData';
import { GlassCard } from '../components/GlassCard';
import { BreathingPlant } from '../components/BreathingPlant';
import { CircularProgress } from '../components/CircularProgress';
import { TypingText } from '../components/TypingText';
import { SpringTouchable } from '../components/SpringTouchable';
import { AnimatedCounter } from '../components/AnimatedCounter';
import { typography } from '../theme/theme';
import Animated, { FadeInDown } from 'react-native-reanimated';
import {
  Droplet,
  Activity,
  LineChart,
  Sliders,
  Sparkles,
  Thermometer,
  Sun,
  Clock,
  Bell,
  Volume2,
} from 'lucide-react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const PLANT_TAP_QUOTES = [
  "Aha! That tickled. Bioelectric frequency spiked by 24 uV.",
  "I am soaking in this sunlight. Stomata are open at 82% efficiency!",
  "I feel your touch! Respiration levels are nominal. Thank you, Harish.",
  "Transpiration is peaking. Roma Tomato cells are fully saturated.",
  "Listening to nature... and I hear you! Let's grow together."
];

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { plant, colors, waterPlant } = usePlantData();

  const [tappedDialogue, setTappedDialogue] = useState<string | null>(null);

  const getAIMessage = () => {
    if (tappedDialogue) {
      return tappedDialogue;
    }
    if (plant.status === 'Critical') {
      return `Attention, Harish. Roma Tomato is experiencing high distress. Soil moisture has fallen to ${plant.moisture}%. I recommend starting an immediate irrigation cycle.`;
    }
    if (plant.status === 'Needs Attention') {
      return `Good morning, Harish. Roma Tomato is slightly thirsty today. Bioelectric potentials are fluctuating. I estimate irrigation will be required soon.`;
    }
    return `Good morning, Harish. Roma Tomato is extremely active today. Bioelectric activity has increased by 18%. I estimate watering will be needed in approx. 5 hours.`;
  };

  const getMoodColor = (status: string) => {
    if (status === 'Critical') return colors.error;
    if (status === 'Needs Attention') return colors.warning;
    return colors.primary;
  };

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  }).toUpperCase();

  const handlePlantTap = () => {
    const idx = Math.floor(Math.random() * PLANT_TAP_QUOTES.length);
    setTappedDialogue(PLANT_TAP_QUOTES[idx]);
    
    // Clear custom dialogue back to standard system telemetry logs after 7 seconds
    setTimeout(() => {
      setTappedDialogue(null);
    }, 7000);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {/* Flagship Top Header Row */}
        <Animated.View entering={FadeInDown.duration(600).delay(100)} style={styles.headerRow}>
          <View style={styles.headerTextGroup}>
            <Text style={[styles.currentDate, { color: colors.primary }]}>{formattedDate}</Text>
            <Text style={[styles.greetingSub, { color: colors.text }]}>Listening to Nature</Text>
            <Text style={[styles.greetingMain, { color: colors.primaryDark }]}>
              Good Morning, Harish 👋
            </Text>
          </View>
          <SpringTouchable style={[styles.bellBtn, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Bell size={20} color={colors.text} />
          </SpringTouchable>
        </Animated.View>

        {/* Biophysical Status Row */}
        <Animated.View entering={FadeInDown.duration(600).delay(200)} style={styles.bioStatusRow}>
          <View style={styles.bioStatusLeft}>
            <Text style={[styles.plantTitle, { color: colors.text }]}>🌱 ROMA TOMATO</Text>
            <View style={styles.bulletRow}>
              <View style={[styles.bulletDot, { backgroundColor: getMoodColor(plant.status) }]} />
              <Text style={[styles.bulletText, { color: getMoodColor(plant.status) }]}>
                {plant.status === 'Healthy' ? 'Photosynthesis is excellent' : plant.status === 'Needs Attention' ? 'Root pressure is dry' : 'Distress detected'}
              </Text>
            </View>
          </View>
          <View style={styles.bioStatusRight}>
            <CircularProgress
              size={82}
              strokeWidth={7}
              progress={plant.health}
              colors={colors}
              fontSize={20}
            />
          </View>
        </Animated.View>

        {/* Dynamic Interpolated Environment Chips */}
        <Animated.View entering={FadeInDown.duration(600).delay(300)} style={styles.chipsRow}>
          <GlassCard colors={colors} style={styles.metricChip}>
            <Thermometer size={18} color="#EF4444" style={styles.chipIcon} />
            <AnimatedCounter
              value={plant.temperature}
              decimals={1}
              suffix="°C"
              style={[styles.chipVal, { color: colors.text }]}
            />
            <Text style={[styles.chipLabel, { color: colors.textMuted }]}>Temp</Text>
          </GlassCard>

          <GlassCard colors={colors} style={styles.metricChip}>
            <Sun size={18} color="#F59E0B" style={styles.chipIcon} />
            <AnimatedCounter
              value={plant.humidity}
              decimals={0}
              suffix="%"
              style={[styles.chipVal, { color: colors.text }]}
            />
            <Text style={[styles.chipLabel, { color: colors.textMuted }]}>Humidity</Text>
          </GlassCard>

          <GlassCard colors={colors} style={styles.metricChip}>
            <Droplet size={18} color="#3B82F6" style={styles.chipIcon} />
            <AnimatedCounter
              value={plant.moisture}
              decimals={0}
              suffix="%"
              style={[styles.chipVal, { color: colors.text }]}
            />
            <Text style={[styles.chipLabel, { color: colors.textMuted }]}>Moisture</Text>
          </GlassCard>

          <GlassCard colors={colors} style={styles.metricChip}>
            <Clock size={18} color="#10B981" style={styles.chipIcon} />
            <Text style={[styles.chipVal, { color: colors.text }]}>
              {plant.moisture > 45 ? '5h 20m' : plant.moisture > 30 ? '1h 10m' : 'NOW'}
            </Text>
            <Text style={[styles.chipLabel, { color: colors.textMuted }]}>Watering</Text>
          </GlassCard>
        </Animated.View>

        {/* Large Hero Plant Section with Tap Handlers */}
        <Animated.View entering={FadeInDown.duration(600).delay(400)} style={styles.heroSection}>
          <BreathingPlant
            imageUri={plant.image}
            health={plant.health}
            status={plant.status}
            size={SCREEN_HEIGHT * 0.33}
            onPress={handlePlantTap}
          />
        </Animated.View>

        {/* AI Companion Speech bubble */}
        <Animated.View entering={FadeInDown.duration(600).delay(500)} style={styles.aiSection}>
          <GlassCard colors={colors} style={styles.aiCard}>
            <View style={styles.aiHeader}>
              <View style={styles.aiTitleRow}>
                <Sparkles size={16} color={colors.primary} />
                <Text style={[styles.aiTitle, { color: colors.text }]}>AI Companion</Text>
              </View>
              <View style={[styles.liveBadge, { backgroundColor: colors.primaryLight + '25' }]}>
                <View style={[styles.liveDot, { backgroundColor: colors.primary }]} />
                <Text style={[styles.liveText, { color: colors.primaryDark }]}>Live</Text>
              </View>
            </View>
            {/* Typing text element */}
            <TypingText
              text={getAIMessage()}
              speed={15}
              style={[styles.aiBodyText, { color: colors.text }]}
            />
            <View style={[styles.audioIconWrap, { backgroundColor: colors.primaryLight + '35' }]}>
              <Volume2 size={16} color={colors.primaryDark} />
            </View>
          </GlassCard>
        </Animated.View>

        {/* Quick Actions Panel */}
        <Animated.View entering={FadeInDown.duration(600).delay(600)} style={styles.quickActionsSection}>
          <Text style={[styles.sectionHeading, { color: colors.text }]}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            
            <View style={styles.actionItemContainer}>
              <SpringTouchable
                onPress={waterPlant}
                style={[styles.circularActionBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
              >
                <Droplet size={22} color="#3B82F6" />
              </SpringTouchable>
              <Text style={[styles.actionBtnLabel, { color: colors.text }]}>Water</Text>
              <Text style={[styles.actionBtnSub, { color: colors.textMuted }]}>Now</Text>
            </View>

            <View style={styles.actionItemContainer}>
              <SpringTouchable
                onPress={() => navigation.navigate('LiveSignals')}
                style={[styles.circularActionBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
              >
                <Activity size={22} color={colors.primary} />
              </SpringTouchable>
              <Text style={[styles.actionBtnLabel, { color: colors.text }]}>Live</Text>
              <Text style={[styles.actionBtnSub, { color: colors.textMuted }]}>Signals</Text>
            </View>

            <View style={styles.actionItemContainer}>
              <SpringTouchable
                onPress={() => navigation.navigate('AnalyticsTab')}
                style={[styles.circularActionBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
              >
                <LineChart size={22} color={colors.warning} />
              </SpringTouchable>
              <Text style={[styles.actionBtnLabel, { color: colors.text }]}>History</Text>
              <Text style={[styles.actionBtnSub, { color: colors.textMuted }]}>View</Text>
            </View>

            <View style={styles.actionItemContainer}>
              <SpringTouchable
                onPress={() => navigation.navigate('AutomationTab')}
                style={[styles.circularActionBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
              >
                <Sliders size={22} color={colors.primaryDark} />
              </SpringTouchable>
              <Text style={[styles.actionBtnLabel, { color: colors.text }]}>Automation</Text>
              <Text style={[styles.actionBtnSub, { color: colors.textMuted }]}>Manage</Text>
            </View>

          </View>
        </Animated.View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerTextGroup: {
    flex: 1,
  },
  currentDate: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  greetingSub: {
    fontSize: typography.fontSizes.giant - 2, // 52px
    fontWeight: typography.fontWeights.bold,
    letterSpacing: -2,
    lineHeight: 52,
  },
  greetingMain: {
    fontSize: typography.fontSizes.xl + 6, // 34px
    fontWeight: typography.fontWeights.semibold,
    letterSpacing: -1,
    marginTop: 2,
  },
  bellBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  bioStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 14,
  },
  bioStatusLeft: {
    flex: 1,
  },
  plantTitle: {
    fontSize: typography.fontSizes.md + 2, // 20px
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  bulletDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  bulletText: {
    fontSize: 13,
    fontWeight: '700',
  },
  bioStatusRight: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginVertical: 12,
  },
  metricChip: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
  },
  chipIcon: {
    marginBottom: 6,
  },
  chipVal: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  chipLabel: {
    fontSize: 9,
    fontWeight: '700',
    marginTop: 2,
    textTransform: 'uppercase',
  },
  heroSection: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    width: '100%',
  },
  aiSection: {
    marginVertical: 12,
  },
  aiCard: {
    borderRadius: 28,
    padding: 18,
    borderWidth: 1,
    position: 'relative',
  },
  aiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  aiTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  aiTitle: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  liveText: {
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  aiBodyText: {
    fontSize: typography.fontSizes.md - 2, // 18px
    lineHeight: 25,
    fontWeight: '600',
  },
  audioIconWrap: {
    position: 'absolute',
    right: 14,
    bottom: 14,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActionsSection: {
    marginTop: 18,
  },
  sectionHeading: {
    fontSize: typography.fontSizes.lg + 2, // 24px
    fontWeight: typography.fontWeights.bold,
    marginBottom: 12,
    letterSpacing: -0.8,
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  actionItemContainer: {
    alignItems: 'center',
  },
  circularActionBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 8,
  },
  actionBtnLabel: {
    fontSize: 12,
    fontWeight: '800',
    textAlign: 'center',
  },
  actionBtnSub: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 1,
  },
});
