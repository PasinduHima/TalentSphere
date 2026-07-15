import React from 'react';
import { Tag } from 'antd';
import { APPLICATION_STATUSES, JOB_STATUSES } from '../../lib/constants';

export default function StatusBadge({ status, type = 'application' }) {
  let color = 'default';

  if (type === 'application') {
    switch (status) {
      case APPLICATION_STATUSES.APPLIED:
        color = 'processing';
        break;
      case APPLICATION_STATUSES.SCREENING:
      case APPLICATION_STATUSES.INTERVIEW:
        color = 'warning';
        break;
      case APPLICATION_STATUSES.OFFER:
      case APPLICATION_STATUSES.HIRED:
        color = 'success';
        break;
      case APPLICATION_STATUSES.REJECTED:
        color = 'error';
        break;
      default:
        color = 'default';
    }
  } else if (type === 'job') {
    switch (status) {
      case JOB_STATUSES.ACTIVE:
        color = 'success';
        break;
      case JOB_STATUSES.DRAFT:
      case JOB_STATUSES.PAUSED:
        color = 'warning';
        break;
      case JOB_STATUSES.CLOSED:
        color = 'default';
        break;
      default:
        color = 'default';
    }
  }

  return (
    <Tag color={color} style={{ borderRadius: '4px', border: 'none', padding: '2px 8px', fontWeight: 500, margin: 0 }}>
      {status}
    </Tag>
  );
}
