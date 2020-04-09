import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Spinner from "../common/Spinner";
import { getUsers } from "../../actions/profileAct";
import UserData from "./UserData";

class Users extends Component {

    componentDidMount() {
        this.props.getUsers();
    }

    render() {
        const { profiles, loading } = this.props.profile;

        let userItems;

        if (profiles === null || loading) {
            userItems = <Spinner />;
        }
        else {

            if (profiles.length > 0) {
                userItems = <UserData profiles={profiles} />
            } else {
                userItems = <h4>No Users Found....</h4>;
            }
        }

        return (
            <div className="users">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <h1 className="display-4 text-center">Profiles</h1>
                            <p className="lead text-center">
                                Browser and Connect
                            </p>
                            {userItems}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

Users.propTypes = {
    getUsers: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    profile: state.profile
});

export default connect(mapStateToProps, { getUsers })(Users);
