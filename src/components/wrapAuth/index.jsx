import React, { useState, useEffect, Component } from 'react';
export let wrapAuth = (ComposedComponent) =>
  class WrapComponent extends Component {
    constructor(props) {
      super(props);
    }
    productLine = JSON.parse(localStorage.getItem('info')).product_line_id;
    role = JSON.parse(localStorage.getItem('info')).role;
    render() {
      if (this.role == 10) {
        return <ComposedComponent {...this.props} />;
      } else {
        if (this.props.productLine == this.productLine) {
          return <ComposedComponent {...this.props} />;
        } else {
          return null;
        }
      }
    }
  };
