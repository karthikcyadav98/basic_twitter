import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { deleteAccount } from '../../actions/authAct'

class Dashboard extends Component {

    onDeleteClick(e) {
        this.props.deleteAccount();
    }

    render() {
        const { user } = this.props.auth
        return (
            <div className="dashboard">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <h1 className="display-3">Dashboard</h1>
                            <h1 className="display-6">
                                Welcome <strong>{user.name}</strong>
                            </h1>
                            <p className="lead ">
                                This is your dashboard below are the operation you can perform.
                            </p>
                            <ul>
                                <li>
                                    <p className="lead ">Login and Logout(Auth is secured by jwt token)</p>
                                </li>
                                <li>
                                    <p className="lead ">View all Users and search users.</p>
                                </li>
                                <li>
                                    <p className="lead ">Post Tweets and search tweets.</p>
                                </li>
                                <li>
                                    <p className="lead ">Like and Unlike the tweets.</p>
                                </li>
                                <li>
                                    <p className="lead ">Comment and Uncommnet the tweets.</p>
                                </li>
                                <li>
                                    <p className="lead ">Delete your account if no more required</p>
                                </li>
                            </ul>
                            <br />
                            <button
                                onClick={this.onDeleteClick.bind(this)}
                                className="btn btn-danger"
                            >
                                Delete My Account
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

Dashboard.propTypes = {
    deleteAccount: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    auth: state.auth
});
export default connect(mapStateToProps, { deleteAccount })(
    Dashboard
);
