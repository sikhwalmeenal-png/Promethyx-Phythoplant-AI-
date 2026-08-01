import React from 'react';
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
import { MiniLineChart } from '../components/MiniLineChart';
import { SpringTouchable } from '../components/SpringTouchable';
import { typography, spacing } from '../theme/theme';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ArrowLeft, Activity, Radio, Sparkles } from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const LiveSignalsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { plant, colors } = usePlantData();

  const getBioelectricStatus = () => {
    if (plant.bioelectricSignal > 90) return 'Strong vegetative pulse. Photosynthesis cell walls active.';
    if (plant.bioelectricSignal > 60) return 'Stable biophysical rhythm. Normal respiration detected.';
    return 'Weak potential currents. Stomatal cell closure in progress due to stress.';
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      {/* Top Header */}
      <View style={styles.header}>
        <SpringTouchable
          onPress={() => navigation.goBack()}
          style={[styles.circleBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          <ArrowLeft size={20} color={colors.text} />
        </SpringTouchable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Biophysical Telemetry</Text>
        <View style={styles.liveIndicator}>
          <View style={[styles.liveDot, { backgroundColor: colors.success }]} />
          <Text style={[styles.liveText, { color: colors.success }]}>LIVE FEED</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
        
        {/* Real-time Oscilloscope Wave Card */}
        <Animated.View entering={FadeInDown.duration(600).delay(100)}>
          <GlassCard colors={colors} style={styles.oscilloscopeCard}>
            <View style={styles.waveMeta}>
              <View style={styles.iconTitleRow}>
                <View style={[styles.iconWrap, { backgroundColor: colors.primary + '15' }]}>
                  <Activity size={22} color={colors.primary} />
                </View>
                <View>
                  <Text style={[styles.cardTitle, { color: colors.text }]}>Bio-Potential Wave</Text>
                  <Text style={[styles.cardSub, { color: colors.textMuted }]}>Direct cellular microvoltage stream</Text>
                </View>
              </View>
              <Text style={[styles.currentSignalValue, { color: colors.primary }]}>
                {plant.bioelectricSignal} <Text style={{ fontSize: 16 }}>uV</Text>
              </Text>
            </View>

            {/* Scrolling SVG Waveform */}
            <MiniLineChart
              data={plant.history.map(h => h.bioelectricSignal)}
              width={SCREEN_WIDTH - 40 - 36}
              height={180}
              strokeColor={colors.primary}
              fillColorStart={colors.primary}
              fillColorEnd={colors.primary}
              showAxes
            />
          </GlassCard>
        </Animated.View>

        {/* Translation insight bubble */}
        <Animated.View entering={FadeInDown.duration(600).delay(250)} style={styles.sectionSpace}>
          <GlassCard colors={colors} style={styles.insightCard}>
            <View style={styles.insightHeader}>
              <Sparkles size={16} color={colors.primary} />
              <Text style={[styles.insightTitle, { color: colors.text }]}>Stomata Signal translation</Text>
            </View>
            <Text style={[styles.insightBody, { color: colors.text }]}>
              "{getBioelectricStatus()}"
            </Text>
          </GlassCard>
        </Animated.View>

        {/* Hardware loop stats */}
        <Animated.View entering={FadeInDown.duration(600).delay(400)} style={styles.sectionSpace}>
          <Text style={[styles.sectionHeading, { color: colors.text }]}>Telemetry Diagnostics</Text>
          <GlassCard colors={colors} style={styles.diagnosticsCard}>
            <View style={styles.diagnosticRow}>
              <View style={styles.diagnosticLabelRow}>
                <Radio size={16} color={colors.primary} />
                <Text style={[styles.diagnosticLabel, { color: colors.text }]}>ESP32 Loop Freq</Text>
              </View>
              <Text style={[styles.diagnosticValue, { color: colors.primary }]}>60 Hz (Calibrated)</Text>
            </View>

            <View style={styles.diagnosticRow}>
              <View style={styles.diagnosticLabelRow}>
                <Activity size={16} color={colors.primary} />
                <Text style={[styles.diagnosticLabel, { color: colors.text }]}>Stomatal Aperture (Est.)</Text>
              </View>
              <Text style={[styles.diagnosticValue, { color: colors.text }]}>74% (Optimal)</Text>
            </View>

            <View style={[styles.diagnosticRow, { borderBottomWidth: 0, paddingBottom: 0 }]}>
              <View style={styles.diagnosticLabelRow}>
                <Activity size={16} color={colors.primary} />
                <Text style={[styles.diagnosticLabel, { color: colors.text }]}>Transpiration Yield</Text>
              </View>
              <Text style={[styles.diagnosticValue, { color: colors.success }]}>91% Efficiency</Text>
            </View>
          </GlassCard>
        </Animated.View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  circleBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: typography.fontSizes.md + 1, // 19px
    fontWeight: typography.fontWeights.bold,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  liveText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
  },
  oscilloscopeCard: {
    borderRadius: 30,
    padding: 18,
    borderWidth: 1,
  },
  waveMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: typography.fontSizes.sm + 1, // 15px
    fontWeight: typography.fontWeights.bold,
  },
  cardSub: {
    fontSize: 10.5,
    marginTop: 2,
  },
  currentSignalValue: {
    fontSize: typography.fontSizes.xl + 4, // 32px
    fontWeight: '800',
  },
  sectionSpace: {
    marginTop: spacing.xl,
  },
  insightCard: {
    borderRadius: 26,
    padding: 20,
    borderWidth: 1,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  insightTitle: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  insightBody: {
    fontSize: typography.fontSizes.md + 1, // 19px
    lineHeight: 28,
    fontStyle: 'italic',
    fontWeight: '500',
  },
  sectionHeading: {
    fontSize: typography.fontSizes.xl, // 28px
    fontWeight: typography.fontWeights.bold,
    marginBottom: 14,
    letterSpacing: -0.8,
  },
  diagnosticsCard: {
    borderRadius: 28,
    padding: 20,
    borderWidth: 1,
  },
  diagnosticRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 14,
    marginBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(128,128,128,0.15)',
  },
  diagnosticLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  diagnosticLabel: {
    fontSize: typography.fontSizes.sm, // 14px
    fontWeight: typography.fontWeights.semibold,
  },
  diagnosticValue: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.bold,
  },
});
