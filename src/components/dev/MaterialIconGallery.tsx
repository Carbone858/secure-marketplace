import React from 'react';
import * as MdIcons from 'react-icons/md';

const iconKeys = Object.keys(MdIcons).filter((key) => key.startsWith('Md'));

export default function MaterialIconGallery() {
  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 24 }}>Material Design Icons Gallery</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 24 }}>
        {iconKeys.map((key) => {
          const Icon = MdIcons[key];
          return (
            <div key={key} style={{ textAlign: 'center', fontSize: 16 }}>
              <Icon size={40} style={{ marginBottom: 8 }} />
              <div style={{ fontSize: 12, wordBreak: 'break-all' }}>{key}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
