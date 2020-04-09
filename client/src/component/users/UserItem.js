import React, { Component } from "react";
import PropTypes from "prop-types";

class UserItem extends Component {
    render() {
        const { profile } = this.props;

        return (
            <div className="card card-body bg-light mb-3">
                <div className="row">
                    <div className="col-2">
                        <img
                            src={profile.avatar}
                            alt=""
                            className="rounded-circle"
                        ></img>
                    </div>
                    <div className="col-lg-6 col-md-4 col-8">
                        <h3>{profile.name}</h3>
                    </div>
                </div>
            </div>
        );
    }
}

UserItem.propTypes = {
    profile: PropTypes.object.isRequired
};

export default UserItem;
