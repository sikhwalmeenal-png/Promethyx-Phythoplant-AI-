import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { usePlantData } from '../hooks/usePlantData';
import { GlassCard } from '../components/GlassCard';
import { typography, spacing } from '../theme/theme';
import {
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Droplet,
  ArrowRight
} from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const AlertsScreen: React.FC = () => {
  const { alerts, colors, resolveAlert, waterPlant } = usePlantData();

  const handleAction = (alert: any) => {
    if (alert.plantId) {
      // If it is moisture stress, water the plant
      if (alert.title.toLowerCase().includes('water') || alert.title.toLowerCase().includes('moisture')) {
        waterPlant();
      } else {
        // Otherwise, resolve the alert normally
        resolveAlert(alert.id);
      }
    } else {
      resolveAlert(alert.id);
    }
  };

  const getAlertIcon = (type: string, resolved: boolean) => {
    if (resolved) return <CheckCircle2 size={18} color={colors.success} />;
    if (type === 'danger') return <ShieldAlert size={18} color={colors.error} />;
    return <AlertTriangle size={18} color={colors.warning} />;
  };

  const getAlertColor = (type: string, resolved: boolean) => {
    if (resolved) return colors.success;
    if (type === 'danger') return colors.error;
    return colors.warning;
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Stomata Notifications</Text>
        <Text style={[styles.headerSubtitle, { color: colors.textMuted }]}>
          Biometric logs and environmental warning logs
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {alerts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <CheckCircle2 size={50} color={colors.success} style={{ opacity: 0.5 }} />
            <Text style={[styles.emptyText, { color: colors.text }]}>All systems nominal</Text>
            <Text style={[styles.emptySubText, { color: colors.textMuted }]}>No biophysical anomalies detected in the last 48 hours.</Text>
          </View>
        ) : (
          <View style={styles.timelineContainer}>
            {/* Draw a subtle vertical line in background to anchor the timeline dots */}
            <View style={[styles.timelineLine, { backgroundColor: colors.border }]} />

            {alerts.map((alert, index) => {
              const accentColor = getAlertColor(alert.type, alert.resolved);
              const isMoistureAlert = alert.title.toLowerCase().includes('water') || alert.title.toLowerCase().includes('moisture');

              return (
                <View key={alert.id} style={styles.timelineItem}>
                  {/* Timeline Indicator Badge */}
                  <View style={[
                    styles.timelineBadge,
                    {
                      backgroundColor: colors.card,
                      borderColor: accentColor,
                      borderWidth: alert.resolved ? 1 : 2
                    }
                  ]}>
                    {getAlertIcon(alert.type, alert.resolved)}
                  </View>

                  {/* Log Content Card */}
                  <View style={styles.cardContainer}>
                    <GlassCard colors={colors} style={[
                      styles.alertCard,
                      !alert.resolved ? { borderLeftWidth: 4, borderLeftColor: accentColor } : {}
                    ]}>
                      <View style={styles.cardHeader}>
                        <Text style={[styles.alertTitle, { color: colors.text }]}>
                          {alert.title}
                        </Text>
                        <Text style={[styles.timeText, { color: colors.textMuted }]}>
                          {alert.timestamp}
                        </Text>
                      </View>

                      {alert.plantName && (
                        <Text style={[styles.plantLabel, { color: colors.primaryDark }]}>
                          Target: {alert.plantName}
                        </Text>
                      )}

                      <Text style={[styles.alertMessage, { color: colors.textMuted }]}>
                        {alert.message}
                      </Text>

                      {/* Diagnostic suggestions */}
                      {!alert.resolved && (
                        <View style={[styles.suggestionBox, { backgroundColor: colors.background, borderColor: colors.border }]}>
                          <Text style={[styles.suggestionTitle, { color: colors.text }]}>Recommendation:</Text>
                          <Text style={[styles.suggestionText, { color: colors.textMuted }]}>
                            {isMoistureAlert
                              ? 'Activate irrigation cycle to restore cellular turgidity pressure.'
                              : 'Ventilate canopy spacing or activate smart fan speed to disperse ambient heat.'}
                          </Text>

                          <TouchableOpacity
                            onPress={() => handleAction(alert)}
                            style={[
                              styles.actionBtn,
                              { backgroundColor: accentColor }
                            ]}
                          >
                            {isMoistureAlert ? (
                              <Droplet size={14} color="#FFF" style={styles.actionIcon} />
                            ) : null}
                            <Text style={styles.actionBtnText}>
                              {isMoistureAlert ? 'Start Irrigation' : 'Acknowledge Warning'}
                            </Text>
                            <ArrowRight size={14} color="#FFF" style={{ marginLeft: 4 }} />
                          </TouchableOpacity>
                        </View>
                      )}

                      {alert.resolved && (
                        <View style={styles.resolvedFooter}>
                          <CheckCircle2 size={12} color={colors.success} />
                          <Text style={[styles.resolvedText, { color: colors.success }]}>
                            Resolved & logged safely
                          </Text>
                        </View>
                      )}
                    </GlassCard>
                  </View>
                </View>
              );
            })}
          </View>
        )}
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
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.bold,
    marginTop: 16,
  },
  emptySubText: {
    fontSize: typography.fontSizes.sm,
    textAlign: 'center',
    paddingHorizontal: 40,
    marginTop: 8,
    lineHeight: 20,
  },
  timelineContainer: {
    position: 'relative',
    paddingLeft: 24,
  },
  timelineLine: {
    position: 'absolute',
    left: 17,
    top: 15,
    bottom: 15,
    width: 2,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 20,
    position: 'relative',
  },
  timelineBadge: {
    position: 'absolute',
    left: -24,
    top: 12,
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  cardContainer: {
    flex: 1,
    paddingLeft: 16,
  },
  alertCard: {
    borderRadius: 22,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  alertTitle: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.bold,
    flex: 1,
    paddingRight: 8,
  },
  timeText: {
    fontSize: 9,
    fontWeight: '500',
  },
  plantLabel: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  alertMessage: {
    fontSize: typography.fontSizes.xs,
    marginTop: 8,
    lineHeight: 18,
  },
  suggestionBox: {
    marginTop: 14,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  suggestionTitle: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  suggestionText: {
    fontSize: 11,
    marginTop: 4,
    lineHeight: 16,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginTop: 12,
  },
  actionIcon: {
    marginRight: 6,
  },
  actionBtnText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '800',
  },
  resolvedFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(128,128,128,0.1)',
    paddingTop: 10,
  },
  resolvedText: {
    fontSize: 10,
    fontWeight: '700',
  },
});
