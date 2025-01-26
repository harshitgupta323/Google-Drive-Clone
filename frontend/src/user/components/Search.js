import {  useNavigate } from 'react-router-dom';
import React from 'react'

const SearchBar = ({ searchQuery, setSearchQuery }) => {
    const history = useNavigate();
    const onSubmit = (e) => {
        history.push(`?s=${searchQuery}`);
        e.preventDefault();
    };

    return (
        <form
            action="/userdashboard"
            method="get"
            autoComplete="off"
            onSubmit={onSubmit}
        >
            <label htmlFor="header-search">
                <span className="visually-hidden">
                    Enter name of Heathcare Professional/Organization
                </span>
            </label>
            <input
                value={searchQuery}
                onInput={(e) => setSearchQuery(e.target.value)}
                type="text"
                id="header-search"
                placeholder=" Enter name of Heathcare Professional/Organization"
                name="s"
                style={{width: "25rem"}}
            />
            
        </form>
    );
};

export default SearchBar;