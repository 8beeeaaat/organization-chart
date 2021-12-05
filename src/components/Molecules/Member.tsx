import classnames from 'classnames';
import { memo } from 'react';
import { KEY, Member as _Member } from '../../types';
import { Tooltip } from '../Atoms/Tooltip';

type Props = {
  member: _Member;
};

export const Member: React.FC<Props> = memo(({ member }) => {
  const { division, department, streamAlignedTeam, tag, commits, role } =
    member;
  return (
    <dl
      data-tooltip-target={`${streamAlignedTeam.name}_${tag[KEY]}_${member.name}`}
      className='relative font-semibold w-full '
    >
      <dt className='text-gray-800 text-sm'>{member.dispname}</dt>
      <dd className=' text-gray-400 mt-2' style={{ fontSize: 10 }}>
        {division.name} / {department.name}
      </dd>
      <dd className=' text-gray-400 text-xs'>{role.name}</dd>
      <dd className='flex rounded-lg overflow-hidden mt-2 bg-gray-200'>
        {Object.keys(member.commits)
          .filter((c) => member.commits[c].rate > 0)
          .reduce((doms, c) => {
            for (let i = 0; i < member.commits[c].rate; i++) {
              doms.push(
                <div
                  key={`${streamAlignedTeam.name}_${tag[KEY]}_${member.name}_${c}_${i}`}
                  className={classnames('h-2', 'border-gray-200')}
                  style={{
                    width: `${10}%`,
                    background: member.commits[c].color,
                  }}
                ></div>
              );
            }
            return doms;
          }, [] as React.ReactNode[])}
      </dd>
      <dd className='grid gap-1 mt-1'>
        {Object.keys(commits)
          .filter((key) => Number(commits[key].rate) > 0)
          .map((teamKey) => (
            <span className='text-xs text-gray-600'>
              {commits[teamKey].name}: {commits[teamKey].rate * 10}%
            </span>
          ))}
      </dd>
      <i className='absolute -right-4 -top-4 flex justify-center items-center bg-gray-200 text-xs rounded-full w-6 h-6 text-gray-400'>
        {member.tag[KEY]}
      </i>
    </dl>
  );
});

Tooltip.displayName = 'Tooltip';
