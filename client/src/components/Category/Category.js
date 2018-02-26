import React from 'react';
import './Category.css';

const Category = ({ selectCategory, selectedCategory, categories }) => (
    <div className="category-container">
        <h1 className="category-title">Sports</h1>
        {
            categories.map(c => {
                return <div key={c.id} className={selectedCategory === c.name ? "category category-selected" : "category"} onClick={() => selectCategory(c.name)}>{c.name}</div>;
            })
        }
    </div>
);

export default Category;
