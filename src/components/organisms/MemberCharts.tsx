import classnames from 'classnames';
import React, { useEffect } from 'react';
import { KEY, Master, Organization, Team } from '../../types';
import { Tooltip } from '../Atoms/Tooltip';
import { Member } from '../Molecules/Member';
interface Props extends React.HTMLAttributes<HTMLElement> {
  organization: Organization;
  master: Master;
}
export const MemberCharts: React.FC<Props> = (props) => {
  const { organization, master } = props;
  const { teams } = master;
  const [teamCommits, setTeamCommits] =
    React.useState<{ [key: Team['key']]: number; sum: number }>();

  useEffect(() => {
    setTeamCommits(
      Object.keys(master.teams).reduce(
        (sum, teamKey) => {
          sum[teamKey] = Object.keys(organization[teamKey])
            .map((tag) => organization[teamKey][tag])
            .flat()
            .filter((m) => m.featureTeam[KEY] === teamKey)
            .reduce((teamSum, member) => {
              teamSum += member.commits[teamKey].rate;
              return teamSum;
            }, 0);
          sum.sum += sum[teamKey];
          return sum;
        },
        { sum: 0 } as { [key: Team['key']]: number; sum: number }
      )
    );
  }, [master.teams, organization]);

  return (
    <div
      className={classnames('grid', 'grid-flow-row', 'gap-24', props.className)}
    >
      <div className={classnames('shadow-md', 'p-4')}>
        {!teamCommits ? null : (
          <Tooltip
            texts={Object.keys(teams).map(
              (teamKey) =>
                `${teams[teamKey].name}: ${Math.floor(
                  ((teamCommits[teamKey] || 1) / (teamCommits.sum || 0)) * 100
                )}%`
            )}
          >
            <ul
              className={classnames('flex', 'rounded-full', 'overflow-hidden')}
            >
              {Object.keys(teams).map((teamKey) => (
                <li
                  className={classnames('h-4')}
                  style={{
                    background: teams[teamKey].color,
                    width: `${
                      ((teamCommits[teamKey] || 1) / (teamCommits.sum || 0)) *
                      100
                    }%`,
                  }}
                ></li>
              ))}
            </ul>
          </Tooltip>
        )}
      </div>
      {Object.keys(teams).map((teamKey) => {
        const team = teams[teamKey];
        const teamMembers = organization[teamKey];
        return (
          <section
            className={classnames('grid', 'grid-flow-row', props.className)}
          >
            <h2
              className={classnames(
                'font-extrabold',
                'text-3xl',
                'text-center',
                'flex',
                'justify-self-center',
                'justify-center',
                'p-2'
              )}
              style={{
                color: team.color,
              }}
              key={`${teamKey}-name`}
            >
              {team.name}
            </h2>
            <main
              key={`${teamKey}-body`}
              className={classnames('gap-10', 'mt-8')}
            >
              <ul
                className={classnames(
                  'grid',
                  'grid-flow-row',
                  'gap-16',
                  'py-16'
                )}
              >
                {Object.keys(teamMembers)
                  .filter((t) => teamMembers[t].length)
                  .map((tagKey) => (
                    <li
                      className={classnames('flex', 'gap-4', 'justify-center')}
                      key={`${teamKey}_${tagKey}`}
                    >
                      <ul
                        className={classnames(
                          'flex',
                          'w-full',
                          'gap-4',
                          'justify-center',
                          'flex-wrap'
                        )}
                      >
                        {teamMembers[tagKey].map((member) => (
                          <li
                            className={classnames(
                              'flex',
                              'justify-center',
                              'w-full',
                              'max-w-xs',
                              'p-4',
                              'shadow-sm',
                              'hover:shadow-md'
                            )}
                            key={`${teamKey}_${tagKey}_${member.name}`}
                          >
                            <Member member={member}></Member>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
              </ul>
            </main>
          </section>
        );
      })}
    </div>
  );
};
