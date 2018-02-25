import React from 'react';
import './Subcategory.css';

const SubCategory = ({ subcategories, selectedCategory, getEvents }) => (
    <div className="subcategory-container">
        <h1 className="subcategories-title">{selectedCategory} Competitions</h1>
        <hr/>
        {
            (subcategories || []).map(sc => {
                return <div key={sc.id} onClick={() => getEvents({category: selectedCategory, subCategory: sc.name})} className="subcategory">{sc.name}</div>;
            })
        }
    </div>
);

export default SubCategory;
