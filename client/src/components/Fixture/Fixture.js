import React from 'react';
import './Fixture.css';

const Fixture = ({ selectedFixture }) => {
    let markets = selectedFixture.markets.filter(m => m.displayed);

    return (
        <div className="fixture-container">
            <h1 className="fixture-title">{selectedFixture.name}{selectedFixture.suspended && ' - Suspended'}</h1>
            <h3 className="fixture-categories">{selectedFixture.category} | {selectedFixture.subCategory}</h3>
            <h3 className="fixture-title">Date: {new Date(selectedFixture.startTime).toLocaleString()}</h3>
            {
                markets.map(m => {
                    let outcomes = m.outcomes.filter(o => o.displayed);
                    return (
                        outcomes.length > 0 && <div key={m.marketId}>
                            <div className="market-title">{m.name}{m.suspended && ' - Suspended'}</div>
                            {
                                outcomes.map(o => {
                                    let shouldSuspendBetting = selectedFixture.suspended || m.suspended || o.suspended;
                                    return (
                                        <div key={o.outcomeId} className="outcome-wrapper">
                                            <div className="outcome-title">{o.name}{o.suspended && ' - Suspended'}</div>
                                            <div
                                                className={shouldSuspendBetting ? "outcome-price-suspended" : "outcome-price"}
                                                onClick={() => {
                                                    if (shouldSuspendBetting) {
                                                        return false;
                                                    }
                                                    console.log('bet');
                                                }}
                                            >
                                                {o.price}
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    );
                })
            }
        </div>
    )
};

export default Fixture;
