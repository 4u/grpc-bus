import {
  IGBServiceInfo,
} from '../proto';

// Generates a unique string identifier for service connection info.
export function buildServiceInfoIdentifier(info: IGBServiceInfo): string {
  return `${info.serviceId}-${info.endpoint}`;
}
