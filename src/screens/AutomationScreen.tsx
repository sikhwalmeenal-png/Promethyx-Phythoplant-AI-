import React, { useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  SafeAreaView,
  Dimensions,
  Switch,
  Platform,
} from 'react-native';
import { usePlantData } from '../hooks/usePlantData';
import { GlassCard } from '../components/GlassCard';
import { typography, spacing } from '../theme/theme';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  FadeInDown,
} from 'react-native-reanimated';
import {
  Droplet,
  Fan,
  Bell,
  Cpu,
  ChevronRight,
  TrendingUp,
} from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Custom animated wrapper for physical expand responses
const AutomationCard: React.FC<{
  title: string;
  description: string;
  isActive: boolean;
  icon: React.ReactNode;
  onValueChange: () => void;
  triggerText: string;
  colors: any;
}> = ({ title, description, isActive, icon, onValueChange, triggerText, colors }) => {
  const cardScale = useSharedValue(1);
  const badgeHeight = useSharedValue(0);
  const badgeOpacity = useSharedValue(0);

  useEffect(() => {
    // 1. Spring scale card on active
    cardScale.value = withSpring(isActive ? 1.02 : 1.0, { damping: 10, stiffness: 100 });

    // 2. Expand and reveal the trigger badge
    badgeHeight.value = withSpring(isActive ? 42 : 0, { damping: 14, stiffness: 90 });
    badgeOpacity.value = withTiming(isActive ? 1 : 0, { duration: 250 });
  }, [isActive]);

  const cardAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: cardScale.value }],
      shadowOpacity: isActive ? 0.15 : 0.04,
      borderColor: isActive ? colors.primary : colors.border,
      borderWidth: isActive ? 1.5 : 1,
    };
  });

  const badgeAnimatedStyle = useAnimatedStyle(() => {
    return {
      height: badgeHeight.value,
      opacity: badgeOpacity.value,
      marginTop: isActive ? 14 : 0,
      overflow: 'hidden',
    };
  });

  return (
    <Animated.View style={[styles.switchCard, cardAnimatedStyle]}>
      <View style={styles.cardRow}>
        {/* Left Icon */}
        <View style={[styles.iconContainer, { backgroundColor: colors.primaryLight + '25' }]}>
          {icon}
        </View>

        {/* Content Middle */}
        <View style={styles.cardInfo}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>{title}</Text>
          <Text style={[styles.cardDesc, { color: colors.textMuted }]}>{description}</Text>
        </View>

        {/* Right Switch */}
        <Switch
          value={isActive}
          onValueChange={onValueChange}
          trackColor={{ false: colors.border, true: colors.primary }}
          thumbColor={Platform.OS === 'ios' ? undefined : '#FFF'}
        />
      </View>

      {/* Expanding Trigger Badge */}
      <Animated.View style={[styles.triggerBadgeBox, { backgroundColor: colors.primaryLight + '15' }, badgeAnimatedStyle]}>
        <TrendingUp size={14} color={colors.primaryDark} />
        <Text style={[styles.triggerBadgeText, { color: colors.primaryDark }]}>
          {triggerText}
        </Text>
      </Animated.View>
    </Animated.View>
  );
};

export const AutomationScreen: React.FC = () => {
  const { automation, toggleAutomation, colors } = usePlantData();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <Animated.View entering={FadeInDown.duration(600).delay(100)} style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Stomata Automation</Text>
        <Text style={[styles.headerSubtitle, { color: colors.textMuted }]}>
          Control closed-loop telemetry actions and schedules
        </Text>
      </Animated.View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContainer}
      >
        <View style={styles.cardsStack}>
          <AutomationCard
            title="Auto Ventilation"
            description="Activates canopy fans to disperse build-ups of stale ambient heat."
            isActive={automation.autoFan}
            icon={<Fan size={22} color={colors.primaryDark} />}
            onValueChange={() => toggleAutomation('autoFan')}
            triggerText="Trigger: Temperature > 28°C (Active)"
            colors={colors}
          />

          <AutomationCard
            title="Auto Irrigation"
            description="Irrigates soil automatically when moisture levels dip below 20%."
            isActive={automation.autoIrrigation}
            icon={<Droplet size={22} color={colors.primaryDark} />}
            onValueChange={() => toggleAutomation('autoIrrigation')}
            triggerText="Trigger: Moisture < 20% (Active)"
            colors={colors}
          />

          <AutomationCard
            title="Smart Alerts"
            description="Dispatches push alerts containing bioelectric feedback logs."
            isActive={automation.smartAlerts}
            icon={<Bell size={22} color={colors.primaryDark} />}
            onValueChange={() => toggleAutomation('smartAlerts')}
            triggerText="Dispatching critical events"
            colors={colors}
          />
        </View>

        {/* Coming Soon card */}
        <View style={styles.diagnosticsSection}>
          <Text style={[styles.sectionHeading, { color: colors.text }]}>Next-Gen Diagnostics</Text>
          <Animated.View entering={FadeInDown.duration(500).delay(500)}>
            <GlassCard colors={colors} style={styles.disabledCard}>
              <View style={styles.disabledRow}>
                <View style={[styles.iconContainer, { backgroundColor: '#E5E7EB', opacity: 0.8 }]}>
                  <Cpu size={22} color="#6B7280" />
                </View>

                <View style={styles.disabledInfo}>
                  <View style={styles.badgeRow}>
                    <Text style={[styles.cardTitle, { color: colors.text, opacity: 0.6 }]}>
                      AI Plant Whisperer
                    </Text>
                    <View style={styles.comingBadge}>
                      <Text style={styles.comingBadgeText}>COMING SOON</Text>
                    </View>
                  </View>
                  <Text style={[styles.cardDesc, { color: colors.textMuted, opacity: 0.8, marginTop: 4 }]}>
                    Uses LLMs to translate raw plant bioelectric signals into natural language insights.
                  </Text>
                </View>

                <ChevronRight size={18} color={colors.textMuted} style={{ opacity: 0.5 }} />
              </View>
            </GlassCard>
          </Animated.View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: typography.fontSizes.xxl - 6, // 38px
    fontWeight: typography.fontWeights.bold,
    letterSpacing: -1.2,
    lineHeight: 42,
  },
  headerSubtitle: {
    fontSize: typography.fontSizes.sm + 2, // 18px
    marginTop: 6,
    lineHeight: 24,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 10,
  },
  cardsStack: {
    gap: 18,
  },
  switchCard: {
    borderRadius: 28,
    padding: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.45)', // default transparent glass
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 2,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardInfo: {
    flex: 1,
    paddingHorizontal: 14,
  },
  cardTitle: {
    fontSize: typography.fontSizes.sm + 2, // 18px
    fontWeight: '800',
  },
  cardDesc: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4,
  },
  triggerBadgeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    justifyContent: 'flex-start',
  },
  triggerBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  diagnosticsSection: {
    marginTop: spacing.xl,
  },
  sectionHeading: {
    fontSize: typography.fontSizes.xl - 2, // 26px
    fontWeight: typography.fontWeights.bold,
    marginBottom: 14,
    letterSpacing: -0.8,
  },
  disabledCard: {
    borderRadius: 28,
    padding: 18,
    borderWidth: 1,
  },
  disabledRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  disabledInfo: {
    flex: 1,
    paddingHorizontal: 14,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  comingBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  comingBadgeText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#4B5563',
  },
});
