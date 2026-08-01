import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { usePlantData } from '../hooks/usePlantData';
import { GlassCard } from '../components/GlassCard';
import { MiniLineChart } from '../components/MiniLineChart';
import { typography, spacing } from '../theme/theme';
import {
  TrendingUp,
  Droplet,
  Heart,
  BarChart2,
  Calendar,
} from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const AnalyticsScreen: React.FC = () => {
  const { plant, colors } = usePlantData();

  // Calculate garden summaries
  const averageHealth = plant.health;
  const averageMoisture = plant.moisture;

  // Group plant health states
  const healthyCount = plant.status === 'Healthy' ? 1 : 0;
  const attentionCount = plant.status === 'Needs Attention' ? 1 : 0;
  const criticalCount = plant.status === 'Critical' ? 1 : 0;

  // Mock historical timelines
  const weeklyHealthData = [84, 86, 89, 88, 91, 93, averageHealth];
  const weeklyHealthLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const weeklyMoistureData = [62, 60, 58, 65, 59, 57, averageMoisture];
  const weeklyMoistureLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Telemetry Analytics</Text>
        <Text style={[styles.headerSubtitle, { color: colors.textMuted }]}>
          Garden-wide biometric history and environmental yields
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>

        {/* Analytics Summary Stats Row */}
        <View style={styles.statsRow}>
          <GlassCard colors={colors} style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <Heart size={16} color={colors.primary} />
              <Text style={[styles.summaryTitle, { color: colors.textMuted }]}>Garden Health</Text>
            </View>
            <Text style={[styles.summaryValue, { color: colors.text }]}>{averageHealth}%</Text>
            <Text style={[styles.summarySub, { color: colors.success }]}>+2.4% vs last week</Text>
          </GlassCard>

          <GlassCard colors={colors} style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <Droplet size={16} color="#3B82F6" />
              <Text style={[styles.summaryTitle, { color: colors.textMuted }]}>Avg Moisture</Text>
            </View>
            <Text style={[styles.summaryValue, { color: colors.text }]}>{averageMoisture}%</Text>
            <Text style={[styles.summarySub, { color: colors.textMuted }]}>Within optimal zone</Text>
          </GlassCard>
        </View>

        {/* Garden Health Growth Chart */}
        <View style={styles.chartSection}>
          <Text style={[styles.sectionHeading, { color: colors.text }]}>Bio-Growth Yield Index</Text>
          <GlassCard colors={colors} style={styles.chartCard}>
            <View style={styles.chartMeta}>
              <View style={styles.metaRow}>
                <TrendingUp size={16} color={colors.primary} />
                <Text style={[styles.chartTitle, { color: colors.text }]}>Weekly Bio-Health Progress</Text>
              </View>
              <Text style={[styles.chartSub, { color: colors.textMuted }]}>Aggregate crop biometric score</Text>
            </View>

            <MiniLineChart
              data={weeklyHealthData}
              labels={weeklyHealthLabels}
              width={SCREEN_WIDTH - 40 - 32}
              height={150}
              strokeColor={colors.primary}
              fillColorStart={colors.primary}
              fillColorEnd={colors.primary}
              showAxes
            />
          </GlassCard>
        </View>

        {/* Soil Moisture Timeline Chart */}
        <View style={styles.chartSection}>
          <Text style={[styles.sectionHeading, { color: colors.text }]}>Soil Moisture Gradients</Text>
          <GlassCard colors={colors} style={styles.chartCard}>
            <View style={styles.chartMeta}>
              <View style={styles.metaRow}>
                <Droplet size={16} color="#3B82F6" />
                <Text style={[styles.chartTitle, { color: colors.text }]}>7-Day Moisture Content</Text>
              </View>
              <Text style={[styles.chartSub, { color: colors.textMuted }]}>Soil absorption average rating</Text>
            </View>

            <MiniLineChart
              data={weeklyMoistureData}
              labels={weeklyMoistureLabels}
              width={SCREEN_WIDTH - 40 - 32}
              height={150}
              strokeColor="#3B82F6"
              fillColorStart="#3B82F6"
              fillColorEnd="#3B82F6"
              showAxes
            />
          </GlassCard>
        </View>

        {/* Stress Distribution List layout */}
        <View style={[styles.chartSection, { marginBottom: 30 }]}>
          <Text style={[styles.sectionHeading, { color: colors.text }]}>Crop Distribution</Text>
          <GlassCard colors={colors} style={styles.distCard}>
            <Text style={[styles.distTitle, { color: colors.textMuted }]}>Active Plant Status Distribution</Text>

            <View style={styles.barItem}>
              <View style={styles.barLabelRow}>
                <Text style={[styles.barLabel, { color: colors.text }]}>Optimal / Healthy</Text>
                <Text style={[styles.barVal, { color: colors.success }]}>{healthyCount === 1 ? '100%' : '0%'}</Text>
              </View>
              <View style={[styles.barContainer, { backgroundColor: colors.border }]}>
                <View style={[
                  styles.barFill,
                  {
                    backgroundColor: colors.success,
                    width: `${healthyCount * 100}%`
                  }
                ]} />
              </View>
            </View>

            <View style={styles.barItem}>
              <View style={styles.barLabelRow}>
                <Text style={[styles.barLabel, { color: colors.text }]}>Under Mild Stress</Text>
                <Text style={[styles.barVal, { color: colors.warning }]}>{attentionCount === 1 ? '100%' : '0%'}</Text>
              </View>
              <View style={[styles.barContainer, { backgroundColor: colors.border }]}>
                <View style={[
                  styles.barFill,
                  {
                    backgroundColor: colors.warning,
                    width: `${attentionCount * 100}%`
                  }
                ]} />
              </View>
            </View>

            <View style={[styles.barItem, { marginBottom: 0 }]}>
              <View style={styles.barLabelRow}>
                <Text style={[styles.barLabel, { color: colors.text }]}>Critical Water/Heat Stress</Text>
                <Text style={[styles.barVal, { color: colors.error }]}>{criticalCount === 1 ? '100%' : '0%'}</Text>
              </View>
              <View style={[styles.barContainer, { backgroundColor: colors.border }]}>
                <View style={[
                  styles.barFill,
                  {
                    backgroundColor: colors.error,
                    width: `${criticalCount * 100}%`
                  }
                ]} />
              </View>
            </View>

          </GlassCard>
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
    paddingBottom: 12,
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
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: spacing.lg,
  },
  summaryCard: {
    flex: 1,
    padding: 16,
    borderRadius: 22,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  summaryTitle: {
    fontSize: typography.fontSizes.xs - 2,
    fontWeight: typography.fontWeights.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  summaryValue: {
    fontSize: typography.fontSizes.xxl - 2,
    fontWeight: typography.fontWeights.bold,
    marginTop: 10,
    letterSpacing: -0.5,
  },
  summarySub: {
    fontSize: 9.5,
    fontWeight: '700',
    marginTop: 4,
  },
  chartSection: {
    marginTop: spacing.md,
  },
  sectionHeading: {
    fontSize: typography.fontSizes.lg - 1,
    fontWeight: typography.fontWeights.bold,
    marginBottom: 12,
  },
  chartCard: {
    borderRadius: 26,
    padding: 16,
  },
  chartMeta: {
    marginBottom: 16,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  chartTitle: {
    fontSize: typography.fontSizes.xs + 1,
    fontWeight: typography.fontWeights.bold,
  },
  chartSub: {
    fontSize: 10,
    marginTop: 2,
  },
  distCard: {
    borderRadius: 24,
    padding: 16,
  },
  distTitle: {
    fontSize: typography.fontSizes.xs - 1,
    fontWeight: typography.fontWeights.bold,
    marginBottom: 16,
  },
  barItem: {
    marginBottom: 14,
  },
  barLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  barLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  barVal: {
    fontSize: 11,
    fontWeight: '700',
  },
  barContainer: {
    height: 8,
    borderRadius: 4,
    width: '100%',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
});
