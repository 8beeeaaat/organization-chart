import classnames from 'classnames';
import React from 'react';
import {
  Departments,
  Divisions,
  Groups,
  KEY,
  Master,
  Member,
} from '../../types';
interface Props extends React.HTMLAttributes<HTMLElement> {
  master: Master;
  members: Member[];
}
export const DivisionList: React.FC<Props> = (props) => {
  const { master, members } = props;
  const { divisions, departments, groups } = master;
  const blocks: {
    key: 'division' | 'department' | 'group';
    title: string;
    items: Divisions | Departments | Groups;
    leaderKey: 'isDepartmentManager' | 'isGroupLeader' | 'isDivisionManager';
  }[] = [
    {
      key: 'division',
      title: 'Divisions',
      items: divisions,
      leaderKey: 'isDivisionManager',
    },
    {
      key: 'department',
      title: 'Departments',
      items: departments,
      leaderKey: 'isDepartmentManager',
    },
    {
      key: 'group',
      title: 'Groups',
      items: groups,
      leaderKey: 'isGroupLeader',
    },
  ];
  return (
    <div className={classnames('flex', 'flex-col', 'gap-6', props.className)}>
      {blocks.map(({ key, leaderKey, title, items }) => (
        <dl className={classnames('shadow-md', 'p-4')} key={key}>
          <dt className={classnames('font-bold')}>{title}</dt>
          {Object.keys(items)
            .filter((k) => items[k].name)
            .map((k, i) => (
              <dd
                key={`${key}-${i}`}
                className='font-medium text-sm text-gray mt-2 whitespace-nowrap'
              >
                <span className='text-gray-600 font-semibold'>
                  {items[k].name}
                </span>
                <br />

                {members.find((m) => m[key][KEY] === k && m[leaderKey])
                  ?.dispname ? (
                  <>
                    <span className='text-gray-600'>
                      {
                        members.find((m) => m[key][KEY] === k && m[leaderKey])
                          ?.dispname
                      }
                    </span>{' '}
                    <br />
                  </>
                ) : null}

                <span className='text-gray-600 text-xs'>
                  {members.filter((m) => m[key][KEY] === k).length} members
                </span>
              </dd>
            ))}
        </dl>
      ))}
    </div>
  );
};
