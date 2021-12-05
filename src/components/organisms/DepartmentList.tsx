import classnames from 'classnames';
import React from 'react';
import { Master, Member } from '../../types';
interface Props extends React.HTMLAttributes<HTMLElement> {
  master: Master;
  members: Member[];
}
export const DepartmentList: React.FC<Props> = (props) => {
  const { master, members } = props;
  const { departments, groups } = master;
  return (
    <div className={classnames('flex', 'flex-col', 'gap-6', props.className)}>
      <dl className={classnames('shadow-md', 'p-4')}>
        <dt className={classnames('font-bold')}>Departments</dt>
        {Object.keys(departments)
          .filter((k) => departments[k].name)
          .map((departmentKey) => (
            <>
              <dd
                className={classnames(
                  'font-medium',
                  'text-sm',
                  'mt-2',
                  'whitespace-nowrap'
                )}
              >
                {`${departments[departmentKey].name} --
              ${
                members.find(
                  (m) =>
                    m.department.key === departmentKey && m.isDepartmentManager
                )?.dispname
              }
              `}
              </dd>
            </>
          ))}
      </dl>
      <dl className={classnames('shadow-md', 'p-4')}>
        <dt className={classnames('font-bold')}>Groups</dt>
        {Object.keys(groups)
          .filter((k) => groups[k].name)
          .map((groupKey) => (
            <>
              <dd
                className={classnames(
                  'font-medium',
                  'text-sm',
                  'mt-2',
                  'whitespace-nowrap'
                )}
              >
                {`${groups[groupKey].name} --
              ${
                members.find((m) => m.group.key === groupKey && m.isGroupLeader)
                  ?.dispname
              }
              `}
              </dd>
            </>
          ))}
      </dl>
    </div>
  );
};
