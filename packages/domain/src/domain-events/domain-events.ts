import type { ConnectionDeviceChangedDomainEvent } from './connection-device-changed.domain-event';
import type { DeviceConnectedDomainEvent } from './device-connected.domain-event';
import type { DeviceLockedDomainEvent } from './device-locked.domain-event';

export type DomainEvents = {
  DeviceConnectedDomainEvent: DeviceConnectedDomainEvent;
  DeviceLockedDomainEvent: DeviceLockedDomainEvent;
  ConnectionDeviceChangedDomainEvent: ConnectionDeviceChangedDomainEvent;
};

export type DomainEventNames = keyof DomainEvents;
