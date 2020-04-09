import React, { Component } from "react";
import PropTypes from "prop-types";
import PostItem from "./PostItem";

class PostFeed extends Component {

  constructor(props) {
    super(props);

    this.state = {
      posts: this.props.posts
    }

    this.searchTable = this.searchTable.bind(this);
  }

  searchTable = (e) => {
    const string = e.target.value
    const searchPrbatch = this.props.posts.filter(item => Object.keys(item.text).some(k => item.text.toLowerCase().includes(string.toLowerCase())));
    console.log("change", searchPrbatch)

    this.setState({
      posts: searchPrbatch
    })
  }

  render() {
    const posts = this.state.posts

    return (
      <>
        <div className="md-form mt-0">
          <input class="form-control" type="text" placeholder="Search" onChange={this.searchTable} />
        </div>
        <br />
        {posts.map(item => <PostItem key={item._id} post={item} />)}
      </>
    )
  }
}

PostFeed.propTypes = {
  posts: PropTypes.object.isRequired
};

export default PostFeed;
