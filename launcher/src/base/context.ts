import React from 'react';

export let DialogContext: React.Context<(child: React.ReactNode) => undefined>
    = React.createContext((c) => {return undefined;});