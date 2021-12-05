import classnames from 'classnames';
import React from 'react';
import { Master, Organization } from '../../types';
import { Member } from '../Molecules/Member';
interface Props extends React.HTMLAttributes<HTMLElement> {
  organization: Organization;
  master: Master;
}
export const MemberCharts: React.FC<Props> = (props) => {
  const { organization, master } = props;
  const { streamAlignedTeams } = master;

  return (
    <div
      className={classnames(
        ' grid grid-cols-3 gap-4 items-start',
        props.className
      )}
    >
      {Object.keys(organization.membersByTeams).map((streamAlignedTeamKey) => {
        const team = streamAlignedTeams[streamAlignedTeamKey];
        const teamMembers = organization.membersByTeams[streamAlignedTeamKey];
        return (
          <section
            className={classnames(
              'h-full shadow-md rounded-md',
              props.className
            )}
          >
            <h2
              className='font-extrabold text-xl text-center text-white rounded-sm flex justify-center p-1 h-auto'
              style={{
                background: team.color,
              }}
              key={`${streamAlignedTeamKey}-name`}
            >
              {team.name}
            </h2>
            <main
              key={`${streamAlignedTeamKey}-body`}
              className='gap-10 h-full'
            >
              <ul className='grid grid-cols-3 gap-4 pt-4'>
                {Object.keys(organization.membersByTag)
                  .sort((a, b) => master.tags[a].order - master.tags[b].order)
                  .map((tagKey) =>
                    organization.membersByTag[tagKey].filter((m) =>
                      teamMembers.includes(m)
                    ).length ? (
                      <>
                        {organization.membersByTag[tagKey]
                          .filter((m) => teamMembers.includes(m))
                          .map((member) => (
                            <li
                              className={classnames(
                                'flex',
                                'justify-center',
                                'w-full',
                                'max-w-xs',
                                'p-2',
                                'shadow-sm',
                                'hover:shadow-md'
                              )}
                              key={`${streamAlignedTeamKey}_${tagKey}_${member.name}`}
                            >
                              <Member member={member}></Member>
                            </li>
                          ))}
                      </>
                    ) : null
                  )}
              </ul>
            </main>
          </section>
        );
      })}
    </div>
  );
};
