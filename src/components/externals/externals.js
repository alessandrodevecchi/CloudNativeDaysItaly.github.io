"use client";
import React from 'react';
import Tickets from '@/components/tickets/tickets';
import Proposal from '@/components/proposal/proposal';



const Externals = ({data}) => {
    return (
        <div className="flex flex-col md:flex-row gap-4 pb-6">
            <div className="flex-1 card-pop bg-cream p-6">
                <Tickets data={data}/>
            </div>

            <div className="flex-1 card-pop bg-brand-yellow-light p-6">
                <Proposal data={data}/>
            </div>
        </div>
    );
}

export default Externals;
