import type { DeviceConnectedDomainEvent } from './device-connected.domain-event';
import type { DeviceLockedDomainEvent } from './device-locked.domain-event';

export type DomainEvents = {
  DeviceConnectedDomainEvent: DeviceConnectedDomainEvent;
  DeviceLockedDomainEvent: DeviceLockedDomainEvent;
};

export type DomainEventNames = keyof DomainEvents;
