import * as sms from '../services/sms';
import * as providers from '../services/providers';


type S = {
  sms: typeof sms;
  providers: typeof providers;
};

export function getService<T extends keyof S>(name: T): ReturnType<S[T]>;
