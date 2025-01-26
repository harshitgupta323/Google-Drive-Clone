import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Search from "./Search";
import Announcer from "./announcer";
import React from "react";
import "./searchpage.css";
import { useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const filterPosts = (posts, query) => {
  if (!query) {
    return posts;
  }

  return posts.filter((post) => {
    const postName = post.name.toLowerCase();
    return postName.includes(query);
  });
};

const SearchPage = () => {
  const location = useLocation();
  const { setAuth } = useAuth();
  const { auth } = useAuth();
  const { search } = window.location;
  const query = new URLSearchParams(search).get("s");
  const [searchQuery, setSearchQuery] = useState(query || "");
  const navigate = useNavigate();
  
  const handleDivchange = (post) => {
    console.log("Inside div change in Search Page");
    navigate("/detailview", {
      state: {
        userId: post,
        name: post.name,
        address: post.address,
        contact: post.contact,
      },
    });
  };

  const [posts, setPosts] = useState([]);
  const filteredPosts = filterPosts(posts, searchQuery);
  
  let datasize = 0;
  const getData = () => {
    let orgs,hps;
    fetch(process.env.REACT_APP_localhost_https + "/getorganizations")
      .then((resposne) => resposne.json())
      .then((res) => {
        for (let i = 0; i < res.users.length; i++) {
          if (res.users[i].type == 0) {
            res.users[i].type = "Hospital";
          } else if (res.users[i].type == 1) {
            res.users[i].type = "Insurance";
          } else {
            res.users[i].type = "Pharmacy";
          }
        }
       
        fetch(process.env.REACT_APP_localhost_https + "/gethp")
        .then((resposne) => resposne.json())
        .then((res2) => {
         
          for(let i=0;i<res2.users.length;i++){
               res.users.push(res2.users[i]);
          }
         // orgs.concat(hps);
          setPosts(res.users);
         
        })
       
        
      })
      .catch((err) => {
        console.error("Err in Fectching Organizations Search page"+err.message);
        alert(err.message);
      });

  };

  useEffect(() => {
    getData();
    console.log("In User Dashboard Auth " + auth.email);
  }, []);

  return (
    <div className="searchPage">
      <Announcer message={`${filteredPosts.length} posts`} />

      <Search searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <ul>
        {filteredPosts.map((post, index) => (
          <div
            className="box"
            onClick={() => {
              handleDivchange(post);
            }}
            key={index}
          >
            <div>
              <p>
                <h4>{post.name}</h4>
              </p>
              <p>
                <h6>
                  <i>{post.address}</i>
                </h6>
              </p>
              <p>
                Contact: <i>{post.contact}</i>
              </p>
              <p className="orgname">
                Organization Type:<b> {post.type}</b>
              </p>
            </div>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default SearchPage;
