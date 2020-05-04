import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DateRange from './DateRange';
import DefinedRange from './DefinedRange';
import { findNextRangeIndex, generateStyles } from '../utils.js';
import classnames from 'classnames';
import coreStyles from '../styles';

class DateRangePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      focusedRange: [findNextRangeIndex(props.ranges), 0],
    };
    this.styles = generateStyles([coreStyles, props.classNames]);
  }

  render() {
    /**
     * Here I am intercepting the normal unified onChange that gets passed 
     * in and am attaching a label property (i.e. "Last 4 Hours") if the 
     * event came from the list of predefined ranges.
     */
    const specialHandleChange = (event, label) => {
      if (typeof label !== 'undefined') {
        event.selection.label = label;
      } else {
        event.selection.label = '';
      }
      this.props.onChange(event);
    };

    const { focusedRange } = this.state;
    return (
      <div className={classnames(this.styles.dateRangePickerWrapper, this.props.className)}>
        <DefinedRange
          focusedRange={focusedRange}
          onPreviewChange={value => this.dateRange.updatePreview(value)}
          {...this.props}
          range={this.props.ranges[focusedRange[0]]}
          className={undefined}
          onChange={specialHandleChange}
          label={this.props.label}
        />
        <DateRange
          onRangeFocusChange={focusedRange => this.setState({ focusedRange })}
          focusedRange={focusedRange}
          {...this.props}
          onChange={specialHandleChange}
          ref={t => (this.dateRange = t)}
          className={undefined}
        />
      </div>
    );
  }
}

DateRangePicker.defaultProps = {};

DateRangePicker.propTypes = {
  ...DateRange.propTypes,
  ...DefinedRange.propTypes,
  className: PropTypes.string,
};

export default DateRangePicker;
