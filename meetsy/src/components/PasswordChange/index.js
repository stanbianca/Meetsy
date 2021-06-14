import React, { Component } from 'react';
import { COLORS } from '../../constants/designConstants';
import { withFirebase } from '../Firebase';
import { StyleSheet, css } from 'aphrodite';

const INITIAL_STATE = {
  passwordOne: '',
  passwordTwo: '',
  oldPassword: '',
  error: null,
};

const inputStyle = {
  color: 'black'
}

const resetBtn = StyleSheet.create({
  enabledBtn: {
    backgroundColor: COLORS.primaryBlue
  },
  disabledBtn: {
    backgroundColor: COLORS.inputGrey
  }
});

class PasswordChangeForm extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { passwordOne, oldPassword } = this.state;

    if (this.props.firebase.authUser.passwordOne !== oldPassword) {
      this.setState({ error: "Cannot update password" });
      event.preventDefault();
      return
    }

    this.props.firebase
      .doPasswordUpdate(passwordOne)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
      })
      .catch(error => {
        this.setState({ error });
      });
    event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { passwordOne, passwordTwo, oldPassword, error } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo || passwordOne === '';

    return (
      <form onSubmit={this.onSubmit}>
        <input
          name="oldPassword"
          value={oldPassword}
          onChange={this.onChange}
          type="password"
          placeholder="Old Password"
          style={inputStyle}
        />
        <input
          name="passwordOne"
          value={passwordOne}
          onChange={this.onChange}
          type="password"
          placeholder="New Password"
          style={inputStyle}
        />
        <input
          name="passwordTwo"
          value={passwordTwo}
          onChange={this.onChange}
          type="password"
          placeholder="Confirm New Password"
          style={inputStyle}
        />
        <button disabled={isInvalid} type="submit"
          className={
            isInvalid
              ? css(resetBtn.disabledBtn)
              : css(resetBtn.enabledBtn)
          }>
          Reset My Password
        </button>

        {error && <p>{error.message}</p>}
      </form>
    );
  }
}

export default withFirebase(PasswordChangeForm);