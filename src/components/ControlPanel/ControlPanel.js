import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { string, node, bool } from 'prop-types';

import { chunksType, publicationMatchType } from '../../lib/types';

import styles from './ControlPanel.module.css';

const min = (a, b) => (a < b ? a : b);
const max = (a, b) => (a > b ? a : b);

const getFbcnlFromNumbers = (chunk, numbers) => {
  const index = numbers.indexOf(chunk);

  return [
    numbers[0],
    numbers[max(0, index - 1)],
    chunk,
    numbers[min(numbers.length - 1, index + 1)],
    numbers[numbers.length - 1],
  ];
};

const HtmlLink = ({ to, children, ...props }) => (
  <a href={to} {...props}>{children}</a>
);

HtmlLink.propTypes = {
  to: string.isRequired,
  children: node.isRequired,
};

class ControlPanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
    };

    this.toggleOpen = this.toggleOpen.bind(this);
  }

  getLines() {
    const { chunks: { start, end, numbers } } = this.props;

    if (numbers) {
      return numbers;
    }

    const lines = [];
    for (let ii = start; ii <= end; ii += 1) {
      lines.push(ii);
    }

    return lines;
  }

  getFbcnl() {
    const { chunks: { start, end, numbers }, match } = this.props;
    const { params: { chunk } } = match;
    const index = Number(chunk);

    if (numbers) {
      return getFbcnlFromNumbers(chunk, numbers);
    }

    return [
      start,
      max(start, index - 1),
      chunk,
      min(end, index + 1),
      end,
    ];
  }

  toggleOpen() {
    this.setState(({ isOpen }) => ({ isOpen: !isOpen }));
  }

  render() {
    const { refresh } = this.props;
    const { isOpen } = this.state;
    const [first, back, current, next, last] = this.getFbcnl();
    const lines = this.getLines();
    const LinkComponent = refresh ? HtmlLink : Link;

    return (
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        <div className="collapse navbar-collapse justify-content-center" id="navbarsExample10">
          <ul className="navbar-nav">
            <li className="nav-item">
              <LinkComponent className={`nav-link text-light ${styles.link}`} to={`./${first}`}>
                &laquo; First
              </LinkComponent>
            </li>
            <li className="nav-item">
              <LinkComponent className={`nav-link text-light ${styles.link}`} to={`./${back}`}>
                &#8249; Back
              </LinkComponent>
            </li>
            <li className="nav-item dropdown">
              <button className={`btn btn-link nav-link text-light dropdown-toggle ${styles.dropdownButton}`} type="button" aria-haspopup="true" aria-expanded={isOpen} onClick={this.toggleOpen}>
                {current}
              </button>
              <div className={`dropdown-menu ${styles.dropdownScroll} ${isOpen ? 'show' : ''}`}>
                {
                  lines.map((n) => (
                    <LinkComponent className="dropdown-item" key={n} to={`./${n}`} onClick={this.toggleOpen}>
                      {n}
                    </LinkComponent>
                  ))
                }
              </div>
            </li>
            <li className="nav-item">
              <LinkComponent className={`nav-link text-light ${styles.link}`} to={`./${next}`}>
                Next &#8250;
              </LinkComponent>
            </li>
            <li>
              <LinkComponent className={`nav-link text-light ${styles.link}`} to={`./${last}`}>
                Last &raquo;
              </LinkComponent>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}

ControlPanel.propTypes = {
  chunks: chunksType.isRequired,
  match: publicationMatchType.isRequired,
  refresh: bool.isRequired,
};

export default ControlPanel;