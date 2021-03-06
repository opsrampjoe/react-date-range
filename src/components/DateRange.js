import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Calendar from './Calendar.js';
import { rangeShape } from './DayCell';
import { findNextRangeIndex, generateStyles } from '../utils.js';
import { isBefore, differenceInCalendarDays, addDays, min } from 'date-fns';
import classnames from 'classnames';
import coreStyles from '../styles';

class DateRange extends Component {
  constructor(props, context) {
    super(props, context);
    this.setSelection = this.setSelection.bind(this);
    this.handleRangeFocusChange = this.handleRangeFocusChange.bind(this);
    this.updatePreview = this.updatePreview.bind(this);
    this.calcNewSelection = this.calcNewSelection.bind(this);
    this.state = {
      focusedRange: props.initialFocusedRange || [
        findNextRangeIndex(props.ranges),
        0,
      ],
      preview: null,
    };
    this.styles = generateStyles([coreStyles, props.classNames]);
  }
  calcNewSelection(value, isSingleValue = true, focusChange = true) {
    const focusedRange = this.props.focusedRange || this.state.focusedRange;
    const { ranges, onChange, maxDate, moveRangeOnFirstSelection } = this.props;
    const focusedRangeIndex = focusedRange[0];
    const selectedRange = ranges[focusedRangeIndex];
    if (!selectedRange || !onChange) return {};

    let { startDate, endDate } = selectedRange;
    if (!endDate) endDate = new Date(startDate);
    let nextFocusRange;
    if (!isSingleValue) {
      startDate = value.startDate;
      endDate = value.endDate;
      if (!focusChange) {
        nextFocusRange = focusedRange;
      }
    } else if (focusedRange[1] === 0) {
      // startDate selection
      const dayOffset = differenceInCalendarDays(endDate, startDate);
      startDate = value;
      endDate = moveRangeOnFirstSelection ? addDays(value, dayOffset) : value;
      if (maxDate) endDate = min([endDate, maxDate]);
      nextFocusRange = [focusedRange[0], 1];
    } else {
      endDate = value;
    }
    // reverse dates if startDate before endDate
    if (isBefore(endDate, startDate)) {
      [startDate, endDate] = [endDate, startDate];
    }

    if (!nextFocusRange) {
      const nextFocusRangeIndex = findNextRangeIndex(
        this.props.ranges,
        focusedRange[0]
      );
      nextFocusRange = [nextFocusRangeIndex, 0];
    }
    return {
      range: { startDate, endDate },
      nextFocusRange: nextFocusRange,
    };
  }
  setSelection(value, isSingleValue, focusChange) {
    const { onChange, ranges, onRangeFocusChange } = this.props;
    const focusedRange = this.props.focusedRange || this.state.focusedRange;
    const focusedRangeIndex = focusedRange[0];
    const selectedRange = ranges[focusedRangeIndex];
    if (!selectedRange) return;
    const newSelection = this.calcNewSelection(
      value,
      isSingleValue,
      focusChange
    );
    onChange({
      [selectedRange.key || `range${focusedRangeIndex + 1}`]: {
        ...selectedRange,
        ...newSelection.range,
      },
    });
    this.setState({
      focusedRange: newSelection.nextFocusRange,
      preview: null,
    });
    onRangeFocusChange && onRangeFocusChange(newSelection.nextFocusRange);
  }
  handleRangeFocusChange(focusedRange) {
    this.setState({ focusedRange });
    this.props.onRangeFocusChange &&
      this.props.onRangeFocusChange(focusedRange);
  }
  updatePreview(val) {
    if (!val) {
      this.setState({ preview: null });
      return;
    }
    const { rangeColors, ranges } = this.props;
    const focusedRange = this.props.focusedRange || this.state.focusedRange;
    const color =
      ranges[focusedRange[0]].color || rangeColors[focusedRange[0]] || color;
    this.setState({ preview: { ...val, color } });
  }
  render() {
    return (
      <Calendar
        focusedRange={this.state.focusedRange}
        onRangeFocusChange={this.handleRangeFocusChange}
        preview={this.state.preview}
        onPreviewChange={value => {
          this.updatePreview(value ? this.calcNewSelection(value).range : null);
        }}
        {...this.props}
        displayMode="dateRange"
        className={classnames(
          this.styles.dateRangeWrapper,
          this.props.className
        )}
        onChange={this.setSelection}
        updateRange={(val, focusChange) =>
          this.setSelection(val, false, focusChange)
        }
        ref={target => {
          this.calendar = target;
        }}
      />
    );
  }
}

DateRange.defaultProps = {
  classNames: {},
  ranges: [],
  moveRangeOnFirstSelection: false,
  rangeColors: ['#0077C8', '#3ecf8e', '#fed14c'],
};

DateRange.propTypes = {
  ...Calendar.propTypes,
  onChange: PropTypes.func,
  onRangeFocusChange: PropTypes.func,
  className: PropTypes.string,
  ranges: PropTypes.arrayOf(rangeShape),
  moveRangeOnFirstSelection: PropTypes.bool,
};

export default DateRange;
