import Link from "next/link";
import React from "react";
import navStyles from "styles/Nav.module.scss";
import PropTypes from "prop-types";
import Swipe from "react-easy-swipe";
import classnames from 'classnames';


const IDLE = "idle";
const VERTICAL = "vertical";
const HORIZONTAL = "horizontal";


class NavMenu extends React.Component {
  constructor(){
    super();
    this.state = {
      swiping: false,
      direction: IDLE,
      swipePos: {x: 0, y: 0},
    }
  }

  render() {
    const {
      isOpen,
      closeCallback,
    } = this.props;

    return (
      <div
        className={classnames(navStyles.NavMenu, (isOpen ? navStyles.NavMenuOpen : null))}
      >
          <div className={navStyles.NavMenuHeader}>
            <div
              className={navStyles.NavTrigger}
              onClick={closeCallback.bind(this)}
              ></div>
            <h1>MENU</h1>
          <div
            className={navStyles.NavClose}
            onClick={closeCallback.bind(this)}
          ></div>
        </div>
      </div>
    )
  }
}


NavMenu.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closeCallback: PropTypes.func.isRequired,
}


export default class Nav extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      menuOpen: true,
    }
  };

  openMenu() {
    this.setState({menuOpen: true});
  }

  closeMenu() {
    this.setState({menuOpen: false});
  }

  render() {
    return (
      <div>
        <nav className={navStyles.Nav}>
          <div
            className={navStyles.NavTrigger}
            onClick={this.openMenu.bind(this)}
          ></div>
        </nav>
        <NavMenu
          isOpen={this.state.menuOpen}
          closeCallback={this.closeMenu.bind(this)}
        />
      </div>
    )
  }
}
