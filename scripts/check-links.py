#!/usr/bin/env python3
"""校验仓库内所有 Markdown 的本地相对链接可解析。

跳过行内代码与代码块:形如 `[English](foo.md)` 是在演示字面写法,不是可解析的链接。
外链(http/https)与纯 fragment 不在本脚本职责内。
退出码 1 表示存在死链。
"""
import os, re, sys, posixpath

def strip_code(text):
    text = re.sub(r'```.*?```', '', text, flags=re.S)
    return re.sub(r'`[^`\n]*`', '', text)

def main():
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    os.chdir(root)
    dead, checked, external = [], 0, 0
    for dirpath, dirnames, filenames in os.walk('.'):
        dirnames[:] = [d for d in dirnames if d != '.git']
        for name in filenames:
            if not name.endswith('.md'):
                continue
            rel = os.path.relpath(os.path.join(dirpath, name), '.').replace(os.sep, '/')
            body = strip_code(open(rel, encoding='utf-8').read())
            for match in re.finditer(r'\[([^\]]+)\]\(([^)]+)\)', body):
                target = match.group(2)
                if target.startswith(('http://', 'https://', 'mailto:')):
                    external += 1
                    continue
                if target.startswith('#'):
                    continue
                checked += 1
                path = target.split('#')[0]
                if not path:
                    continue
                resolved = posixpath.normpath(posixpath.join(posixpath.dirname(rel), path))
                if not os.path.exists(resolved):
                    dead.append(f'{rel} -> {target}')
    print(f'本地相对链接 {checked} 条,外链 {external} 条,死链 {len(dead)} 条')
    for item in dead:
        print(f'  ✗ {item}')
    return 1 if dead else 0

if __name__ == '__main__':
    sys.exit(main())
