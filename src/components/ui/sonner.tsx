'use client';

import React from 'react';
import { Toaster as Sonner, type ToasterProps } from 'sonner';

const Toaster = (props: ToasterProps) => (
    <Sonner
        {...props}
        position="top-center"
        closeButton
        richColors
    />
);

export default Toaster;
