import type { ConnectionDeviceChangedDomainEvent } from './connection-device-changed.domain-event';
import type { DeviceBatteryChangedDomainEvent } from './device-battery-changed.domain-event';
import type { DeviceCleanWorkChangedDomainEvent } from './device-clean-work-changed.domain-event';
import type { DeviceConnectedDomainEvent } from './device-connected.domain-event';
import type { DeviceCreatedDomainEvent } from './device-created.domain-event';
import type { DeviceLockedDomainEvent } from './device-locked.domain-event';
import type { DeviceNetworkChangedDomainEvent } from './device-network-changed.domain-event';
import type { DeviceSettingsChangedDomainEvent } from './device-settings-changed.domain-event';
import type { DeviceVersionChangedDomainEvent } from './device-version-changed.domain-event';

export type DomainEvents = {
  ConnectionDeviceChangedDomainEvent: ConnectionDeviceChangedDomainEvent;
  DeviceBatteryChangedDomainEvent: DeviceBatteryChangedDomainEvent;
  DeviceCleanWorkChangedDomainEvent: DeviceCleanWorkChangedDomainEvent;
  DeviceConnectedDomainEvent: DeviceConnectedDomainEvent;
  DeviceCreatedDomainEvent: DeviceCreatedDomainEvent;
  DeviceLockedDomainEvent: DeviceLockedDomainEvent;
  DeviceNetworkChangedDomainEvent: DeviceNetworkChangedDomainEvent;
  DeviceSettingsChangedDomainEvent: DeviceSettingsChangedDomainEvent;
  DeviceVersionChangedDomainEvent: DeviceVersionChangedDomainEvent;
};

export type DomainEventNames = keyof DomainEvents;
