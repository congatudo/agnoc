import type { ConnectionDeviceChangedDomainEvent } from './connection-device-changed.domain-event';
import type { DeviceBatteryChangedDomainEvent } from './device-battery-changed.domain-event';
import type { DeviceCleanWorkChangedDomainEvent } from './device-clean-work-changed.domain-event';
import type { DeviceConnectedDomainEvent } from './device-connected.domain-event';
import type { DeviceCreatedDomainEvent } from './device-created.domain-event';
import type { DeviceErrorChangedDomainEvent } from './device-error-changed.domain-event';
import type { DeviceFanSpeedChangedDomainEvent } from './device-fan-speed-changed.domain-event';
import type { DeviceLockedDomainEvent } from './device-locked.domain-event';
import type { DeviceMapPendingDomainEvent } from './device-map-pending.domain-event';
import type { DeviceModeChangedDomainEvent } from './device-mode-changed.domain-event';
import type { DeviceMopAttachedDomainEvent } from './device-mop-attached.domain-event';
import type { DeviceNetworkChangedDomainEvent } from './device-network-changed.domain-event';
import type { DeviceSettingsChangedDomainEvent } from './device-settings-changed.domain-event';
import type { DeviceStateChangedDomainEvent } from './device-state-changed.domain-event';
import type { DeviceVersionChangedDomainEvent } from './device-version-changed.domain-event';
import type { DeviceWaterLevelChangedDomainEvent } from './device-water-level-changed.domain-event';

export type DomainEvents = {
  ConnectionDeviceChangedDomainEvent: ConnectionDeviceChangedDomainEvent;
  DeviceBatteryChangedDomainEvent: DeviceBatteryChangedDomainEvent;
  DeviceCleanWorkChangedDomainEvent: DeviceCleanWorkChangedDomainEvent;
  DeviceConnectedDomainEvent: DeviceConnectedDomainEvent;
  DeviceCreatedDomainEvent: DeviceCreatedDomainEvent;
  DeviceErrorChangedDomainEvent: DeviceErrorChangedDomainEvent;
  DeviceFanSpeedChangedDomainEvent: DeviceFanSpeedChangedDomainEvent;
  DeviceLockedDomainEvent: DeviceLockedDomainEvent;
  DeviceMapPendingDomainEvent: DeviceMapPendingDomainEvent;
  DeviceModeChangedDomainEvent: DeviceModeChangedDomainEvent;
  DeviceMopAttachedDomainEvent: DeviceMopAttachedDomainEvent;
  DeviceNetworkChangedDomainEvent: DeviceNetworkChangedDomainEvent;
  DeviceSettingsChangedDomainEvent: DeviceSettingsChangedDomainEvent;
  DeviceStateChangedDomainEvent: DeviceStateChangedDomainEvent;
  DeviceVersionChangedDomainEvent: DeviceVersionChangedDomainEvent;
  DeviceWaterLevelChangedDomainEvent: DeviceWaterLevelChangedDomainEvent;
};

export type DomainEventNames = keyof DomainEvents;
