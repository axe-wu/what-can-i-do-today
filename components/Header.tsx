import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center py-8 md:py-12">
      <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 dark:text-white tracking-tight">
        <span className="text-sky-500">今天</span>我能做什么?
      </h1>
      <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
        获取为你量身定制的今日灵感，开启更精彩的生活。
      </p>
    </header>
  );
};

export default Header;
