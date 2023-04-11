import { ConnectionDeviceChangedDomainEvent } from './connection-device-changed.domain-event';
import { DeviceBatteryChangedDomainEvent } from './device-battery-changed.domain-event';
import { DeviceCleanWorkChangedDomainEvent } from './device-clean-work-changed.domain-event';
import { DeviceConnectedDomainEvent } from './device-connected.domain-event';
import { DeviceCreatedDomainEvent } from './device-created.domain-event';
import { DeviceErrorChangedDomainEvent } from './device-error-changed.domain-event';
import { DeviceFanSpeedChangedDomainEvent } from './device-fan-speed-changed.domain-event';
import { DeviceLockedDomainEvent } from './device-locked.domain-event';
import { DeviceMapChangedDomainEvent } from './device-map-changed.domain-event';
import { DeviceMapPendingDomainEvent } from './device-map-pending.domain-event';
import { DeviceModeChangedDomainEvent } from './device-mode-changed.domain-event';
import { DeviceMopAttachedDomainEvent } from './device-mop-attached.domain-event';
import { DeviceNetworkChangedDomainEvent } from './device-network-changed.domain-event';
import { DeviceOrdersChangedDomainEvent } from './device-orders-changed.domain-event';
import { DeviceSettingsChangedDomainEvent } from './device-settings-changed.domain-event';
import { DeviceStateChangedDomainEvent } from './device-state-changed.domain-event';
import { DeviceVersionChangedDomainEvent } from './device-version-changed.domain-event';
import { DeviceWaterLevelChangedDomainEvent } from './device-water-level-changed.domain-event';
import type { InstanceTypeProps } from '@agnoc/toolkit';

export const DomainEvents = {
  ConnectionDeviceChangedDomainEvent,
  DeviceBatteryChangedDomainEvent,
  DeviceCleanWorkChangedDomainEvent,
  DeviceConnectedDomainEvent,
  DeviceCreatedDomainEvent,
  DeviceErrorChangedDomainEvent,
  DeviceFanSpeedChangedDomainEvent,
  DeviceLockedDomainEvent,
  DeviceMapChangedDomainEvent,
  DeviceMapPendingDomainEvent,
  DeviceModeChangedDomainEvent,
  DeviceMopAttachedDomainEvent,
  DeviceNetworkChangedDomainEvent,
  DeviceOrdersChangedDomainEvent,
  DeviceSettingsChangedDomainEvent,
  DeviceStateChangedDomainEvent,
  DeviceVersionChangedDomainEvent,
  DeviceWaterLevelChangedDomainEvent,
};

export type DomainEvents = InstanceTypeProps<typeof DomainEvents>;

export type DomainEventNames = keyof DomainEvents;
