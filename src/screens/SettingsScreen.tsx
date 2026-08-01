import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  SafeAreaView,
  Switch,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { usePlantData } from '../hooks/usePlantData';
import { GlassCard } from '../components/GlassCard';
import { typography, spacing } from '../theme/theme';
import Animated, { FadeInDown } from 'react-native-reanimated';
import {
  Sun,
  Gauge,
  Leaf,
  Mail,
  Wifi,
  Cpu,
  ChevronRight,
  Info,
} from 'lucide-react-native';

export const SettingsScreen: React.FC = () => {
  const { theme, toggleTheme, colors } = usePlantData();
  const [useMetric, setUseMetric] = useState(true);
  const [enableTriggers, setEnableTriggers] = useState(true);
  const [dailySummary, setDailySummary] = useState(true);

  const isDark = theme === 'dark';

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <Animated.View entering={FadeInDown.duration(600).delay(100)} style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>System Settings</Text>
        <Text style={[styles.headerSubtitle, { color: colors.textMuted }]}>
          Configure theme, parameters, and telemetry profiles
        </Text>
      </Animated.View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContainer}
      >
        
        {/* Visual Experience Section */}
        <Animated.View entering={FadeInDown.duration(500).delay(200)} style={styles.sectionSpace}>
          <Text style={[styles.groupTitle, { color: colors.text }]}>Visual Experience</Text>
          <GlassCard colors={colors} style={styles.settingsGroupCard}>
            
            {/* Dark Mode Row */}
            <View style={[styles.settingRow, { borderBottomColor: colors.border }]}>
              <View style={[styles.iconWrap, { backgroundColor: '#FEF3C7' }]}>
                <Sun size={20} color="#D97706" />
              </View>
              <View style={styles.textWrap}>
                <Text style={[styles.settingTitle, { color: colors.text }]}>Dark Mode</Text>
                <Text style={[styles.settingDesc, { color: colors.textMuted }]}>
                  Switch interface between dark and light themes.
                </Text>
              </View>
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={Platform.OS === 'ios' ? undefined : '#FFF'}
              />
            </View>

            {/* Measurement Units Row */}
            <View style={styles.settingRow}>
              <View style={[styles.iconWrap, { backgroundColor: '#E0F2FE' }]}>
                <Gauge size={20} color="#0284C7" />
              </View>
              <View style={styles.textWrap}>
                <Text style={[styles.settingTitle, { color: colors.text }]}>Measurement Units</Text>
                <Text style={[styles.settingDesc, { color: colors.textMuted }]}>
                  Display in Metric (°C, mm) or Imperial (°F, in).
                </Text>
              </View>
              <Switch
                value={useMetric}
                onValueChange={setUseMetric}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={Platform.OS === 'ios' ? undefined : '#FFF'}
              />
            </View>

          </GlassCard>
        </Animated.View>

        {/* Push Configurations Section */}
        <Animated.View entering={FadeInDown.duration(500).delay(350)} style={styles.sectionSpace}>
          <Text style={[styles.groupTitle, { color: colors.text }]}>Push Configurations</Text>
          <GlassCard colors={colors} style={styles.settingsGroupCard}>
            
            {/* Anomalous Triggers Row */}
            <View style={[styles.settingRow, { borderBottomColor: colors.border }]}>
              <View style={[styles.iconWrap, { backgroundColor: colors.primaryLight + '35' }]}>
                <Leaf size={20} color={colors.primaryDark} />
              </View>
              <View style={styles.textWrap}>
                <Text style={[styles.settingTitle, { color: colors.text }]}>Anomalous Triggers</Text>
                <Text style={[styles.settingDesc, { color: colors.textMuted }]}>
                  Send alerts on critical moisture or temp levels.
                </Text>
              </View>
              <Switch
                value={enableTriggers}
                onValueChange={setEnableTriggers}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={Platform.OS === 'ios' ? undefined : '#FFF'}
              />
            </View>

            {/* Daily Summary Row */}
            <View style={styles.settingRow}>
              <View style={[styles.iconWrap, { backgroundColor: colors.primaryLight + '35' }]}>
                <Mail size={20} color={colors.primaryDark} />
              </View>
              <View style={styles.textWrap}>
                <Text style={[styles.settingTitle, { color: colors.text }]}>Daily Summary</Text>
                <Text style={[styles.settingDesc, { color: colors.textMuted }]}>
                  Receive daily health summary at 8 AM.
                </Text>
              </View>
              <Switch
                value={dailySummary}
                onValueChange={setDailySummary}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={Platform.OS === 'ios' ? undefined : '#FFF'}
              />
            </View>

          </GlassCard>
        </Animated.View>

        {/* Hardware Sync Section */}
        <Animated.View entering={FadeInDown.duration(500).delay(500)} style={styles.sectionSpace}>
          <Text style={[styles.groupTitle, { color: colors.text }]}>Hardware Sync (Coming Soon)</Text>
          <GlassCard colors={colors} style={styles.settingsGroupCard}>
            
            {/* ESP32 Receiver Row */}
            <TouchableOpacity activeOpacity={0.8} style={[styles.settingRow, { borderBottomColor: colors.border }]}>
              <View style={[styles.iconWrap, { backgroundColor: '#F3F4F6' }]}>
                <Wifi size={20} color="#6B7280" />
              </View>
              <View style={styles.textWrap}>
                <View style={styles.titleBadgeRow}>
                  <Text style={[styles.settingTitle, { color: colors.text, opacity: 0.6 }]}>
                    ESP32 Receiver Calibration
                  </Text>
                  <View style={styles.lockBadge}>
                    <Text style={styles.lockBadgeText}>LOCKED</Text>
                  </View>
                </View>
                <Text style={[styles.settingDesc, { color: colors.textMuted }]}>
                  Calibrate local board WiFi and MQTT loops.
                </Text>
              </View>
              <ChevronRight size={18} color={colors.textMuted} style={{ opacity: 0.5 }} />
            </TouchableOpacity>

            {/* OTA Firmware Row */}
            <TouchableOpacity activeOpacity={0.8} style={styles.settingRow}>
              <View style={[styles.iconWrap, { backgroundColor: '#F3F4F6' }]}>
                <Cpu size={20} color="#6B7280" />
              </View>
              <View style={styles.textWrap}>
                <View style={styles.titleBadgeRow}>
                  <Text style={[styles.settingTitle, { color: colors.text, opacity: 0.6 }]}>
                    OTA Firmware Flashing
                  </Text>
                  <View style={styles.lockBadge}>
                    <Text style={styles.lockBadgeText}>LOCKED</Text>
                  </View>
                </View>
                <Text style={[styles.settingDesc, { color: colors.textMuted }]}>
                  Flash firmware updates directly to Promethyx core.
                </Text>
              </View>
              <ChevronRight size={18} color={colors.textMuted} style={{ opacity: 0.5 }} />
            </TouchableOpacity>

          </GlassCard>
        </Animated.View>

        {/* About Promethyx Section */}
        <Animated.View entering={FadeInDown.duration(500).delay(650)} style={[styles.sectionSpace, { marginBottom: 30 }]}>
          <Text style={[styles.groupTitle, { color: colors.text }]}>About Promethyx</Text>
          <GlassCard colors={colors} style={styles.settingsGroupCard}>
            
            <TouchableOpacity activeOpacity={0.8} style={styles.settingRow}>
              <View style={[styles.iconWrap, { backgroundColor: colors.primaryLight + '35' }]}>
                <Leaf size={20} color={colors.primaryDark} />
              </View>
              <View style={styles.textWrap}>
                <Text style={[styles.settingTitle, { color: colors.text }]}>Promethyx v1.0.0</Text>
                <Text style={[styles.settingDesc, { color: colors.textMuted }]}>
                  Smart plant intelligence for a greener tomorrow.
                </Text>
              </View>
              <ChevronRight size={18} color={colors.textMuted} style={{ opacity: 0.5 }} />
            </TouchableOpacity>

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
  sectionSpace: {
    marginTop: spacing.md,
  },
  groupTitle: {
    fontSize: typography.fontSizes.sm, // 14px
    fontWeight: typography.fontWeights.bold,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: spacing.xs,
    paddingLeft: 4,
  },
  settingsGroupCard: {
    borderRadius: 28,
    paddingVertical: 4,
    paddingHorizontal: 16,
    borderWidth: 1,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: 'transparent', // replaced dynamically
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  textWrap: {
    flex: 1,
    paddingRight: 10,
  },
  settingTitle: {
    fontSize: typography.fontSizes.sm + 1, // 15px
    fontWeight: typography.fontWeights.bold,
  },
  settingDesc: {
    fontSize: 11,
    marginTop: 4,
    lineHeight: 15,
  },
  titleBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  lockBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  lockBadgeText: {
    fontSize: 7,
    fontWeight: '800',
    color: '#4B5563',
  },
});
