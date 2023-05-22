import type * as CSS from 'csstype';

declare module 'csstype' {
  interface Properties {
    // Add a missing property
    '-moz-transform'?: Property.Transform | undefined;
  }
}
