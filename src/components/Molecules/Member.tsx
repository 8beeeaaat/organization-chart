import classnames from 'classnames';
import { memo } from 'react';
import { KEY, Member as _Member } from '../../types';
import { Tooltip } from '../Atoms/Tooltip';
// ツールチップ内に表示するためのprops
type Props = {
  member: _Member;
};

// ツールチップ
export const Member: React.FC<Props> = memo(({ member }) => {
  const { department, featureTeam, tag, commits, role } = member;
  return (
    <Tooltip
      texts={[
        department.name,
        member.dispname,
        ...Object.keys(commits)
          .filter((key) => Number(commits[key].rate) > 0)
          .map(
            (teamKey) =>
              `${commits[teamKey].name}: ${commits[teamKey].rate * 10}%`
          ),
      ]}
    >
      <dl
        data-tooltip-target={`${featureTeam.name}_${tag[KEY]}_${member.name}`}
      >
        <dt className={classnames('font-semibold')}>{member.dispname}</dt>
        <dd>{role.name}</dd>
        <dd className={classnames('flex', 'rounded-lg', 'overflow-hidden')}>
          {Object.keys(member.commits)
            .filter((c) => member.commits[c].rate > 0)
            .reduce((doms, c) => {
              for (let i = 0; i < member.commits[c].rate; i++) {
                doms.push(
                  <div
                    key={`${featureTeam.name}_${tag[KEY]}_${member.name}_${c}_${i}`}
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
      </dl>
    </Tooltip>
  );
});

Tooltip.displayName = 'Tooltip';
