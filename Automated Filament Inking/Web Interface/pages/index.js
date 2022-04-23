import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

import GcodeViewer from '../components/GcodeViewer';
import FileUpload from '../components/FileUpload';
import FileInfo from '../components/Preview';
import ManualProfileMaker from '../components/ManualProfileMaker';
import { Tab } from '@headlessui/react';

import { useState } from 'react';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Home() {
  const [ gcode, setGcodeData ] = useState('');
  const [ colorChanges, setColorChanges ] = useState({});
  
  const getGcodeData = (gcode) => {
    setGcodeData(gcode);
  };

  const getColorChanges = (colorChanges) => {
    setColorChanges(colorChanges);
  };

  

  return (
    <div className=''>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className='h-screen w-full px-10 bg-slate-800'>
        <div className='flex items-center justify-between'>
          <div className='py-10 text-2xl font-bold text-slate-100'>
            Automated Filament Inking
          </div>
          <div className='fill-slate-100 hover:fill-slate-400'>
            <a
              href="https://github.com/ealitt/Multi-Color-Inking"
              target="_blank"
              rel="noopener noreferrer">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            </a>
          </div>
        </div>
        <div className='h-3/4 flex m-auto flex-row space-x-2 px-20'>
          <div  className="w-1/3 h-full bg-slate-400 rounded-lg flex flex-col">
            <Tab.Group>
              <Tab.List className={"flex h-12 m-6 space-x-1 bg-blue-900/20 rounded-xl"}>
                <Tab className={({ selected }) =>
                  classNames(
                    'w-full py-2.5 px-1 text-sm leading-5 font-medium text-slate-700 rounded-lg',
                    'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-slate-400 ring-white ring-opacity-60',
                    selected
                      ? 'bg-white shadow'
                      : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                  )
                }>Upload File</Tab>
                <Tab className={({ selected }) =>
                  classNames(
                    'w-full py-2.5 px-1 text-sm leading-5 font-medium text-slate-700 rounded-lg',
                    'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-slate-400 ring-white ring-opacity-60',
                    selected
                      ? 'bg-white shadow'
                      : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                  )
                }>Manual</Tab>
                <Tab className={({ selected }) =>
                  classNames(
                    'w-full py-2.5 px-1 text-sm leading-5 font-medium text-slate-700 rounded-lg',
                    'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-slate-400 ring-white ring-opacity-60',
                    selected
                      ? 'bg-white shadow'
                      : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                  )
                }>Preview</Tab>
              </Tab.List>
              <Tab.Panels className={'h-5/6 box-border px-6 rounded-lg'}>
                <Tab.Panel className={'p-4'}>
                  <FileUpload getGcodeData={getGcodeData} colorChanges={colorChanges}></FileUpload>
                </Tab.Panel>
                <Tab.Panel>
                  <ManualProfileMaker></ManualProfileMaker>
                </Tab.Panel>
                <Tab.Panel className={'h-full m-auto'}>
                  <FileInfo colorChanges={colorChanges}></FileInfo>
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </div>
          <GcodeViewer gcodeSource={gcode} getColorChanges={getColorChanges}></GcodeViewer>
        </div>
      </main>

      <footer className='flex p-8 white'>
        <div className='m-auto'>
          <a
            href="https://souzoumaker.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            A project by{' '}
            <span className='p-1'>
              <Image src="/logo.png" alt="Souzoumaker Logo" width={16} height={16} />
            </span>
            Souzoumaker
          </a>
        </div>
      </footer>
    </div>
  )
}
