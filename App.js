import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { db, initDatabase } from './src/services/db';

const C = {
  burgundy: '#790D16',
  cream: '#F5EFE1',
  gold: '#C8A45D',
  line: 'rgba(121, 13, 22, 0.2)',
  soft: 'rgba(121, 13, 22, 0.05)',
};

const sans = Platform.select({ ios: 'System', android: 'sans-serif' });
const serif = Platform.select({ ios: 'Georgia', android: 'serif' });

const IMG = {
  splash: require('./assets/stayly/splash-resort.png'),
  login: require('./assets/stayly/login-welcome.png'),
  mapThumb: require('./assets/stayly/map-hotel-thumb.png'),
  cove: require('./assets/stayly/hotel-cove.png'),
  palma: require('./assets/stayly/hotel-palma.png'),
  atelier: require('./assets/stayly/hotel-atelier.png'),
  amihan: require('./assets/stayly/hotel-amihan.png'),
  detailHero: require('./assets/stayly/hotel-detail-hero.png'),
  oceanKing: require('./assets/stayly/room-ocean-king.png'),
  gardenTwin: require('./assets/stayly/room-garden-twin.png'),
  summary: require('./assets/stayly/summary-hotel.png'),
  bookingUpcoming: require('./assets/stayly/booking-upcoming.png'),
  bookingPast: require('./assets/stayly/booking-past.png'),
  avatar: require('./assets/stayly/profile-avatar.png'),
  confirmedHero: require('./assets/stayly/booking-confirmed-hero.png'),
};

function T({
  children,
  size = 12,
  weight = '400',
  lineHeight,
  color = C.burgundy,
  face = 'sans',
  italic,
  style,
  ...rest
}) {
  return (
    <Text
      {...rest}
      style={[
        {
          fontFamily: face === 'serif' ? serif : sans,
          fontSize: size,
          fontWeight: weight,
          color,
        },
        lineHeight ? { lineHeight } : null,
        italic ? { fontStyle: 'italic' } : null,
        style,
      ]}
    >
      {children}
    </Text>
  );
}

function Signal({ size = 15, color = C.burgundy }) {
  const bar = size / 4.6;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: size * 0.8 }}>
      {[0, 1, 2, 3].map((i) => (
        <View
          key={i}
          style={{
            width: bar,
            height: size * 0.8 * (0.35 + 0.216 * i),
            marginRight: i === 3 ? 0 : 1,
            borderRadius: 1,
            backgroundColor: color,
          }}
        />
      ))}
    </View>
  );
}

function Wifi({ size = 15, color = C.burgundy }) {
  return (
    <View style={{ width: size, height: size * 0.8, alignItems: 'center', justifyContent: 'flex-start' }}>
      {[0.5, 0.78, 1].map((k, i) => {
        const w = size * k;
        return (
          <View
            key={i}
            style={{
              width: w,
              height: w * 0.72,
              borderTopLeftRadius: 999,
              borderTopRightRadius: 999,
              borderTopWidth: 1.4,
              borderColor: color,
              marginTop: i === 0 ? -w * 0.42 : 0,
            }}
          />
        );
      })}
    </View>
  );
}

function Battery({ color = C.burgundy }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <View
        style={{
          width: 17,
          height: 11,
          borderWidth: 1,
          borderColor: color,
          borderRadius: 3,
          padding: 1.5,
        }}
      >
        <View style={{ flex: 1, backgroundColor: color, borderRadius: 1 }} />
      </View>
      <View
        style={{
          width: 2,
          height: 5,
          marginLeft: 1.5,
          backgroundColor: color,
          borderTopRightRadius: 1,
          borderBottomRightRadius: 1,
        }}
      />
    </View>
  );
}

const GLYPHS = {
  'arrow-left': '\u2190',
  'arrow-right': '\u2192',
  'arrow-up-right': '\u2197',
  'chevron-down': '\u2304',
  'chevron-up': '\u2303',
  'chevron-right': '\u203A',
  check: '\u2713',
  x: '\u2715',
  star: '\u2605',
  heart: '\u2665',
  flower: '\u273F',
};

function Glyph({ char, size, color, weight = '600' }) {
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <T size={size * 0.82} weight={weight} color={color}>
        {char}
      </T>
    </View>
  );
}

function Icon({ name, size = 18, color = C.burgundy }) {
  const s = size;
  const bar = { backgroundColor: color };

  switch (name) {
    case 'check':
    case 'arrow-left':
    case 'chevron-down':
      return <Glyph char={GLYPHS[name]} size={s} color={color} />;

    case 'mail':
      return (
        <View style={{ width: s, height: s, alignItems: 'center', justifyContent: 'center' }}>
          <View
            style={{
              width: s * 0.86,
              height: s * 0.66,
              borderWidth: 1.3,
              borderColor: color,
              borderRadius: 2,
            }}
          />
          <View
            style={{
              position: 'absolute',
              width: s * 0.86,
              height: 1.3,
              backgroundColor: color,
              transform: [{ rotate: '32deg' }],
            }}
          />
        </View>
      );

    case 'eye-off':
      return (
        <View style={{ width: s, height: s, alignItems: 'center', justifyContent: 'center' }}>
          <View
            style={{
              width: s,
              height: s * 0.58,
              borderWidth: 1.3,
              borderColor: color,
              borderRadius: s,
              transform: [{ rotate: '-20deg' }],
            }}
          />
          <View
            style={{
              position: 'absolute',
              width: s * 1.05,
              height: 1.4,
              backgroundColor: color,
              transform: [{ rotate: '-45deg' }],
            }}
          />
        </View>
      );

    case 'search':
      return (
        <View style={{ width: s, height: s }}>
          <View
            style={{
              width: s * 0.68,
              height: s * 0.68,
              borderWidth: 1.4,
              borderColor: color,
              borderRadius: s,
              marginTop: s * 0.02,
              marginLeft: s * 0.02,
            }}
          />
          <View
            style={{
              position: 'absolute',
              width: 1.5,
              height: s * 0.34,
              backgroundColor: color,
              borderRadius: 1,
              right: s * 0.16,
              bottom: s * 0.06,
              transform: [{ rotate: '-45deg' }],
            }}
          />
        </View>
      );

    case 'map-pin':
      return (
        <View style={{ width: s, height: s, alignItems: 'center' }}>
          <View
            style={{
              width: s * 0.78,
              height: s * 0.78,
              borderWidth: 1.4,
              borderColor: color,
              borderRadius: s,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <View
              style={{
                width: s * 0.2,
                height: s * 0.2,
                borderRadius: s,
                backgroundColor: color,
              }}
            />
          </View>
          <View
            style={{
              width: 0,
              height: 0,
              marginTop: -2,
              borderLeftWidth: s * 0.1,
              borderRightWidth: s * 0.1,
              borderTopWidth: s * 0.16,
              borderLeftColor: 'transparent',
              borderRightColor: 'transparent',
              borderTopColor: color,
            }}
          />
        </View>
      );

    case 'calendar':
      return (
        <View style={{ width: s, height: s, alignItems: 'center' }}>
          <View
            style={{
              width: s * 0.86,
              height: s * 0.8,
              borderWidth: 1.3,
              borderColor: color,
              borderRadius: 2.5,
              marginTop: s * 0.16,
              overflow: 'hidden',
            }}
          >
            <View style={{ height: s * 0.24, backgroundColor: color, opacity: 0.9 }} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: s * 0.1 }}>
              {[0, 1, 2].map((i) => (
                <View key={i} style={{ width: s * 0.1, height: s * 0.1, borderRadius: 1, backgroundColor: color }} />
              ))}
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: s * 0.1 }}>
              {[0, 1, 2].map((i) => (
                <View key={i} style={{ width: s * 0.1, height: s * 0.1, borderRadius: 1, backgroundColor: color }} />
              ))}
            </View>
          </View>
          {[-1, 1].map((d) => (
            <View
              key={d}
              style={{
                position: 'absolute',
                top: s * 0.06,
                left: d < 0 ? s * 0.26 : undefined,
                right: d > 0 ? s * 0.26 : undefined,
                width: 1.4,
                height: s * 0.22,
                backgroundColor: color,
                borderRadius: 1,
              }}
            />
          ))}
        </View>
      );

    case 'house':
      return (
        <View style={{ width: s, height: s, alignItems: 'center', justifyContent: 'center' }}>
          <View
            style={{
              width: 0,
              height: 0,
              borderLeftWidth: s * 0.38,
              borderRightWidth: s * 0.38,
              borderBottomWidth: s * 0.32,
              borderLeftColor: 'transparent',
              borderRightColor: 'transparent',
              borderBottomColor: color,
            }}
          />
          <View
            style={{
              width: s * 0.56,
              height: s * 0.38,
              borderWidth: 1.4,
              borderTopWidth: 0,
              borderColor: color,
            }}
          />
        </View>
      );

    case 'user-round':
      return (
        <View style={{ width: s, height: s, alignItems: 'center', justifyContent: 'flex-end' }}>
          <View
            style={{
              width: s * 0.38,
              height: s * 0.38,
              borderRadius: s,
              backgroundColor: color,
              marginBottom: s * 0.06,
            }}
          />
          <View
            style={{
              width: s * 0.78,
              height: s * 0.4,
              borderWidth: 1.4,
              borderBottomWidth: 0,
              borderColor: color,
              borderTopLeftRadius: s,
              borderTopRightRadius: s,
            }}
          />
        </View>
      );

    case 'list':
      return (
        <View style={{ width: s, height: s, justifyContent: 'space-evenly' }}>
          {[0, 1, 2].map((i) => (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ width: s * 0.14, height: s * 0.14, borderRadius: s, backgroundColor: color }} />
              <View
                style={{
                  flex: 1,
                  height: 1.5,
                  marginLeft: s * 0.14,
                  borderRadius: 1,
                  backgroundColor: color,
                }}
              />
            </View>
          ))}
        </View>
      );

    case 'locate-fixed':
      return (
        <View style={{ width: s, height: s, alignItems: 'center', justifyContent: 'center' }}>
          <View
            style={{
              position: 'absolute',
              width: s * 0.4,
              height: s * 0.4,
              borderRadius: s,
              backgroundColor: color,
            }}
          />
          <View
            style={{
              width: s * 0.9,
              height: s * 0.9,
              borderRadius: s,
              borderWidth: 1.4,
              borderColor: color,
            }}
          />
          {[0, 1].map((i) => (
            <View
              key={i}
              style={{
                position: 'absolute',
                backgroundColor: bar.backgroundColor,
                width: i === 0 ? s * 0.16 : s * 1.0,
                height: i === 0 ? s * 1.0 : s * 0.16,
              }}
            />
          ))}
        </View>
      );

    case 'plus-circle':
      return (
        <View style={{ width: s, height: s, alignItems: 'center', justifyContent: 'center' }}>
          <View
            style={{
              position: 'absolute',
              width: s * 0.92,
              height: s * 0.92,
              borderRadius: s,
              borderWidth: 1.4,
              borderColor: color,
            }}
          />
          <View style={{ position: 'absolute', width: s * 0.42, height: 1.5, backgroundColor: color }} />
          <View style={{ position: 'absolute', width: 1.5, height: s * 0.42, backgroundColor: color }} />
        </View>
      );

    case 'minus-circle':
      return (
        <View style={{ width: s, height: s, alignItems: 'center', justifyContent: 'center' }}>
          <View
            style={{
              position: 'absolute',
              width: s * 0.92,
              height: s * 0.92,
              borderRadius: s,
              borderWidth: 1.4,
              borderColor: color,
            }}
          />
          <View style={{ position: 'absolute', width: s * 0.42, height: 1.5, backgroundColor: color }} />
        </View>
      );

    case 'star':
    case 'heart':
    case 'flower':
    case 'x':
    case 'chevron-right':
    case 'chevron-up':
    case 'arrow-right':
    case 'arrow-up-right':
      return <Glyph char={GLYPHS[name]} size={s} color={color} />;

    case 'circle-check':
      return (
        <View style={{ width: s, height: s, alignItems: 'center', justifyContent: 'center' }}>
          <View
            style={{
              position: 'absolute',
              width: s,
              height: s,
              borderRadius: s,
              borderWidth: 1.4,
              borderColor: color,
            }}
          />
          <T size={s * 0.55} weight="700" color={color}>
            {'\u2713'}
          </T>
        </View>
      );

    case 'bell':
      return (
        <View style={{ width: s, height: s, alignItems: 'center', justifyContent: 'center' }}>
          <View
            style={{
              width: s * 0.58,
              height: s * 0.52,
              borderWidth: 1.4,
              borderBottomWidth: 0,
              borderColor: color,
              borderTopLeftRadius: s,
              borderTopRightRadius: s,
            }}
          />
          <View style={{ width: s * 0.86, height: 1.4, borderRadius: 1, backgroundColor: color }} />
          <View
            style={{
              width: s * 0.18,
              height: s * 0.14,
              marginTop: 1.5,
              borderBottomLeftRadius: s,
              borderBottomRightRadius: s,
              backgroundColor: color,
            }}
          />
        </View>
      );

    case 'globe':
      return (
        <View style={{ width: s, height: s, alignItems: 'center', justifyContent: 'center' }}>
          <View
            style={{
              position: 'absolute',
              width: s,
              height: s,
              borderRadius: s,
              borderWidth: 1.4,
              borderColor: color,
            }}
          />
          <View style={{ width: s * 0.44, height: s, borderRadius: s, borderWidth: 1.4, borderColor: color }} />
          <View style={{ position: 'absolute', width: s, height: 1.4, backgroundColor: color, opacity: 0.75 }} />
        </View>
      );

    case 'shield-check':
      return (
        <View style={{ width: s, height: s, alignItems: 'center', justifyContent: 'center' }}>
          <View
            style={{
              position: 'absolute',
              width: s * 0.8,
              height: s * 0.9,
              borderWidth: 1.4,
              borderColor: color,
              borderTopLeftRadius: s * 0.42,
              borderTopRightRadius: s * 0.42,
              borderBottomLeftRadius: s * 0.18,
              borderBottomRightRadius: s * 0.18,
            }}
          />
          <T size={s * 0.44} weight="700" color={color}>
            {'\u2713'}
          </T>
        </View>
      );

    case 'credit-card':
      return (
        <View style={{ width: s, height: s, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ width: s, height: s * 0.22, backgroundColor: color }} />
          <View style={{ width: s, height: s * 0.5, borderWidth: 1.4, borderTopWidth: 0, borderColor: color }} />
        </View>
      );

    case 'lock-keyhole':
      return (
        <View style={{ width: s, height: s, alignItems: 'center', justifyContent: 'flex-end' }}>
          <View
            style={{
              width: s * 0.46,
              height: s * 0.44,
              borderWidth: 1.4,
              borderBottomWidth: 0,
              borderColor: color,
              borderTopLeftRadius: s,
              borderTopRightRadius: s,
            }}
          />
          <View
            style={{
              width: s * 0.72,
              height: s * 0.42,
              borderWidth: 1.4,
              borderColor: color,
              borderRadius: 2.5,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <View style={{ width: s * 0.14, height: s * 0.14, borderRadius: s, backgroundColor: color }} />
          </View>
        </View>
      );

    case 'wallet':
      return (
        <View style={{ width: s, height: s, alignItems: 'center', justifyContent: 'center' }}>
          <View
            style={{
              width: s,
              height: s * 0.72,
              borderRadius: 2.5,
              borderWidth: 1.4,
              borderColor: color,
            }}
          >
            <View
              style={{
                position: 'absolute',
                right: 0,
                width: s * 0.34,
                height: s * 0.3,
                borderLeftWidth: 1.4,
                borderColor: color,
              }}
            />
            <View
              style={{
                position: 'absolute',
                right: s * 0.1,
                top: s * 0.1,
                width: s * 0.12,
                height: s * 0.12,
                borderRadius: s,
                backgroundColor: color,
              }}
            />
          </View>
        </View>
      );

    case 'smartphone':
      return (
        <View style={{ width: s, height: s, alignItems: 'center', justifyContent: 'center' }}>
          <View
            style={{
              width: s * 0.62,
              height: s,
              borderRadius: 3,
              borderWidth: 1.4,
              borderColor: color,
              alignItems: 'center',
              justifyContent: 'flex-end',
              paddingBottom: 1.5,
            }}
          >
            <View style={{ width: s * 0.2, height: s * 0.07, borderRadius: 1, backgroundColor: color }} />
          </View>
        </View>
      );

    case 'wallet-cards':
      return (
        <View style={{ width: s, height: s, alignItems: 'center', justifyContent: 'center' }}>
          <View
            style={{
              position: 'absolute',
              top: s * 0.04,
              width: s * 0.84,
              height: s * 0.5,
              borderRadius: 2.5,
              borderWidth: 1.4,
              borderColor: color,
            }}
          />
          <View
            style={{
              position: 'absolute',
              bottom: s * 0.04,
              width: s,
              height: s * 0.5,
              borderRadius: 2.5,
              borderWidth: 1.4,
              borderColor: color,
            }}
          />
        </View>
      );

    case 'wifi':
      return <Wifi size={s} color={color} />;

    case 'waves':
      return (
        <View style={{ width: s, height: s, alignItems: 'center', justifyContent: 'space-evenly' }}>
          {[0.5, 0.78, 1].map((k, i) => (
            <View
              key={i}
              style={{
                width: s * k,
                height: s * k * 0.5,
                borderBottomLeftRadius: 999,
                borderBottomRightRadius: 999,
                borderBottomWidth: 1.4,
                borderColor: color,
              }}
            />
          ))}
        </View>
      );

    case 'coffee':
      return (
        <View style={{ width: s, height: s, alignItems: 'center', justifyContent: 'flex-end' }}>
          <View style={{ position: 'absolute', top: 0, flexDirection: 'row', gap: s * 0.14 }}>
            <View style={{ width: 1.4, height: s * 0.24, backgroundColor: color }} />
            <View style={{ width: 1.4, height: s * 0.24, backgroundColor: color }} />
          </View>
          <View
            style={{
              width: s * 0.6,
              height: s * 0.46,
              borderWidth: 1.4,
              borderColor: color,
              borderRadius: s * 0.1,
            }}
          />
          <View
            style={{
              position: 'absolute',
              right: s * 0.04,
              bottom: s * 0.54,
              width: s * 0.3,
              height: s * 0.3,
              borderWidth: 1.4,
              borderLeftWidth: 0,
              borderColor: color,
              borderTopRightRadius: s,
              borderBottomRightRadius: s,
            }}
          />
        </View>
      );

    case 'car':
      return (
        <View style={{ width: s, height: s, alignItems: 'center', justifyContent: 'flex-end' }}>
          <View
            style={{
              width: s * 0.52,
              height: s * 0.3,
              borderWidth: 1.4,
              borderBottomWidth: 0,
              borderColor: color,
              borderTopLeftRadius: s * 0.22,
              borderTopRightRadius: s * 0.22,
            }}
          />
          <View
            style={{
              width: s * 0.92,
              height: s * 0.36,
              borderWidth: 1.4,
              borderColor: color,
              borderRadius: s * 0.14,
            }}
          />
          <View
            style={{
              position: 'absolute',
              bottom: -1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: s * 0.6,
            }}
          >
            <View style={{ width: s * 0.16, height: s * 0.16, borderRadius: s, backgroundColor: color }} />
            <View style={{ width: s * 0.16, height: s * 0.16, borderRadius: s, backgroundColor: color }} />
          </View>
        </View>
      );

    case 'dumbbell':
      return (
        <View style={{ width: s, height: s, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ width: s * 0.14, height: s * 0.62, borderRadius: 1.5, backgroundColor: color }} />
          <View style={{ width: s * 0.46, height: s * 0.16 }} />
          <View style={{ width: s * 0.14, height: s * 0.62, borderRadius: 1.5, backgroundColor: color }} />
        </View>
      );

    case 'ticket':
      return (
        <View style={{ width: s, height: s, alignItems: 'center', justifyContent: 'center' }}>
          <View
            style={{
              width: s,
              height: s * 0.64,
              borderRadius: 2.5,
              borderWidth: 1.4,
              borderColor: color,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <View style={{ width: s * 0.14, height: 1.4, backgroundColor: color }} />
            <View style={{ width: s * 0.05, height: 1.4, marginLeft: s * 0.05, backgroundColor: color }} />
            <View style={{ width: s * 0.05, height: 1.4, marginLeft: s * 0.05, backgroundColor: color }} />
          </View>
        </View>
      );

    default:
      return null;
  }
}

function StatusBarMock({ dark = false }) {
  const fg = dark ? C.cream : C.burgundy;
  return (
    <View style={styles.statusBar}>
      <T size={12} weight="600" color={fg}>
        9:41
      </T>
      <View style={{ width: 94, height: 22, borderRadius: 20, backgroundColor: fg }} />
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
        <Signal color={fg} />
        <Wifi color={fg} />
        <Battery color={fg} />
      </View>
    </View>
  );
}

function HomeIndicator({ dark = false }) {
  return (
    <View style={styles.homeIndicatorArea}>
      <View
        style={{
          width: 112,
          height: 4,
          borderRadius: 4,
          backgroundColor: dark ? C.cream : C.burgundy,
        }}
      />
    </View>
  );
}

function Wave({ height = 48, color = C.burgundy }) {
  const count = 12;
  return (
    <View style={[styles.wave, { height }]}>
      {Array.from({ length: count }).map((_, i) => (
        <View
          key={i}
          style={{
            flex: 1,
            height,
            borderBottomLeftRadius: 999,
            borderBottomRightRadius: 999,
            backgroundColor: color,
          }}
        />
      ))}
    </View>
  );
}

function Button({ label, onPress, variant = 'primary', height = 48, style }) {
  const primary = variant === 'primary';
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[
        styles.button,
        {
          height,
          backgroundColor: primary ? C.burgundy : C.cream,
          borderColor: primary ? C.burgundy : C.cream,
        },
        style,
      ]}
    >
      <T size={13} weight="600" color={primary ? C.cream : C.burgundy}>
        {label}
      </T>
    </TouchableOpacity>
  );
}

function TextField({ label, value, icon, height = 54, style, onPress }) {
  const Wrapper = onPress ? TouchableOpacity : View;
  return (
    <Wrapper
      onPress={onPress}
      activeOpacity={0.85}
      style={[styles.textField, { height }, style]}
    >
      <View style={{ flex: 1, gap: 2 }}>
        <T size={10} weight="400">
          {label}
        </T>
        <T size={13} weight="500">
          {value}
        </T>
      </View>
      {icon ? <Icon name={icon} size={18} /> : null}
    </Wrapper>
  );
}

function PageHeading({ title, subtitle, onBack, subtitleLines }) {
  return (
    <View style={{ gap: 8 }}>
      <View style={styles.titleRow}>
        <TouchableOpacity activeOpacity={0.8} onPress={onBack} hitSlop={10}>
          <Icon name="arrow-left" size={20} />
        </TouchableOpacity>
        <T size={30} weight="600" lineHeight={35.4} face="serif" style={{ flex: 1 }}>
          {title}
        </T>
      </View>
      {subtitle ? (
        <T size={12} weight="400" lineHeight={18}>
          {subtitle}
        </T>
      ) : null}
    </View>
  );
}

function BottomNav({ active, onChange }) {
  const items = [
    { key: 'home', label: 'Home', icon: 'house' },
    { key: 'search', label: 'Search', icon: 'search' },
    { key: 'bookings', label: 'Bookings', icon: 'calendar' },
    { key: 'profile', label: 'Profile', icon: 'user-round' },
  ];
  return (
    <View style={styles.bottomNav}>
      {items.map((item) => {
        const on = item.key === active;
        return (
          <TouchableOpacity
            key={item.key}
            activeOpacity={0.8}
            onPress={() => onChange(item.key)}
            style={[styles.navItem, on && styles.navItemActive]}
          >
            <Icon name={item.icon} size={21} />
            <T size={9} weight={on ? '700' : '400'}>
              {item.label}
            </T>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function SplashScreen({ onNext }) {
  return (
    <View style={styles.darkScreen}>
      <StatusBarMock dark />
      <View style={{ height: 310 }}>
        <Image source={IMG.splash} style={styles.heroImage} resizeMode="cover" />
        <Wave height={48} />
      </View>
      <View style={styles.welcomePanel}>
        <T size={32} weight="400" face="serif" color={C.cream}>
          Stayly.
        </T>
        <T size={34} weight="600" lineHeight={40.1} face="serif" color={C.cream}>
          Somewhere lovely.{'\n'}Something yours.
        </T>
        <T size={13} weight="400" lineHeight={19.5} color={C.cream}>
          Find thoughtful hotels, hidden gems and a little room to unwind. Your next escape
          starts here.
        </T>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <View style={{ width: 24, height: 6, borderRadius: 4, backgroundColor: C.cream }} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
        <Button label="Get Started" variant="light" onPress={onNext} />
      </View>
      <HomeIndicator dark />
    </View>
  );
}

function LoginScreen({ onNext, onSignUp }) {
  const [remember, setRemember] = useState(true);
  return (
    <ScrollView
      style={{ flex: 1, width: '100%', backgroundColor: C.cream }}
      contentContainerStyle={{ flexGrow: 1, width: '100%' }}
      showsVerticalScrollIndicator={false}
    >
      <StatusBarMock />
      <Image source={IMG.login} style={{ width: '100%', height: 180 }} resizeMode="cover" />
      <View style={styles.contentGap16}>
        <T size={30} weight="600" lineHeight={35.4} face="serif">
          Welcome back
        </T>
        <T size={12} weight="400" lineHeight={18}>
          Your next beautiful stay is waiting.
        </T>

        <TextField label="Email address" value="sofia.reyes@email.com" icon="mail" />
        <TextField label="Password" value="••••••••••••" icon="eye-off" />

        <View style={styles.spreadRow}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <TouchableOpacity activeOpacity={0.8} onPress={() => setRemember((v) => !v)}>
              <View style={[styles.toggle, !remember && styles.toggleOff]}>
                <View style={[styles.toggleThumb, !remember && styles.toggleThumbOff]} />
              </View>
            </TouchableOpacity>
            <T size={10}>Remember me</T>
          </View>
          <T size={10} weight="600">
            Forgot password?
          </T>
        </View>

        <Button label="Next" onPress={onNext} />

        <T size={10} weight="400" style={{ textAlign: 'center' }}>
          OR CONTINUE WITH
        </T>

        <View style={{ flexDirection: 'row', gap: 8 }}>
          {['G  Google', 'f  Facebook'].map((label) => (
            <TouchableOpacity key={label} activeOpacity={0.85} style={styles.socialButton}>
              <T size={12} weight="600">
                {label}
              </T>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity activeOpacity={0.85} onPress={onSignUp}>
          <T size={11} weight="400" style={{ textAlign: 'center' }}>
            New to Stayly?  Create an account
          </T>
        </TouchableOpacity>
      </View>
      <HomeIndicator />
    </ScrollView>
  );
}

function SignUpScreen({ onCreate, onLogIn }) {
  const [agree, setAgree] = useState(true);
  return (
    <ScrollView
      style={{ flex: 1, width: '100%', backgroundColor: C.cream }}
      contentContainerStyle={{ flexGrow: 1, width: '100%' }}
      showsVerticalScrollIndicator={false}
    >
      <StatusBarMock />
      <View style={styles.contentGap24}>
        <PageHeading title="Join Stayly" onBack={onLogIn} />

        <View style={{ gap: 8 }}>
          <T size={24} weight="600" lineHeight={28.3} face="serif">
            Make yourself at home.
          </T>
          <T size={12} weight="400" lineHeight={18}>
            One account. A world of beautiful stays.{'\n'}Save your favourites and book with ease.
          </T>
        </View>

        <View style={{ gap: 16 }}>
          <TextField label="Full name" value="Sofia Reyes" icon="user-round" />
          <TextField label="Email address" value="sofia.reyes@email.com" icon="mail" />
          <TextField label="Password" value="••••••••••••" icon="eye-off" />
          <TextField label="Confirm password" value="••••••••••••" icon="eye-off" />
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <TouchableOpacity activeOpacity={0.8} onPress={() => setAgree((v) => !v)}>
            <View style={[styles.checkbox, !agree && styles.checkboxOff]}>
              {agree ? <Icon name="check" size={14} color={C.cream} /> : null}
            </View>
          </TouchableOpacity>
          <T size={10} lineHeight={15} style={{ flex: 1 }}>
            I agree to the Terms of Service and{'\n'}Privacy Policy.
          </T>
        </View>

        <Button label="Create Account" onPress={onCreate} />

        <TouchableOpacity activeOpacity={0.85} onPress={onLogIn}>
          <T size={11} weight="400" style={{ textAlign: 'center' }}>
            Already have an account?  Log in
          </T>
        </TouchableOpacity>

        <View style={{ alignItems: 'center' }}>
          <T size={24} weight="400" face="serif">
            Stayly.
          </T>
        </View>
      </View>
      <HomeIndicator />
    </ScrollView>
  );
}

function SearchHotelsScreen({ onBack, onSearch, onTab }) {
  const [guests, setGuests] = useState({ Adults: 2, Children: 0, Rooms: 1 });

  const stepper = (label, sub, key) => (
    <View style={styles.stepper}>
      <View style={{ width: 172, gap: 4 }}>
        <T size={13} weight="600" lineHeight={19.5}>
          {label}
        </T>
        <T size={10}>{sub}</T>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setGuests((g) => ({ ...g, [key]: Math.max(0, g[key] - 1) }))}
        >
          <Icon name="minus-circle" size={24} />
        </TouchableOpacity>
        <T size={15} weight="600">
          {guests[key]}
        </T>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setGuests((g) => ({ ...g, [key]: g[key] + 1 }))}
        >
          <Icon name="plus-circle" size={24} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.lightScreen}>
      <StatusBarMock />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.contentGap24}
        showsVerticalScrollIndicator={false}
      >
        <PageHeading
          title="Find your escape"
          subtitle="A great stay begins with a little curiosity."
          onBack={onBack}
        />

        <TextField label="Destination" value="El Nido, Philippines" icon="map-pin" />

        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TextField
            label="Check-in"
            value="12 Nov 2026"
            icon="calendar"
            style={{ flex: 1 }}
          />
          <TextField
            label="Check-out"
            value="15 Nov 2026"
            icon="calendar"
            style={{ flex: 1 }}
          />
        </View>

        <View style={styles.dateRange}>
          <T size={11} weight="600">
            12 — 15 NOVEMBER
          </T>
          <T size={11} weight="400">
            3 nights
          </T>
        </View>

        <View style={{ gap: 8 }}>
          {stepper('Adults', 'Ages 13 or above', 'Adults')}
          {stepper('Children', 'Ages 0–12', 'Children')}
          {stepper('Rooms', 'Make room to unwind', 'Rooms')}
        </View>

        <Button label="Search Hotels" onPress={onSearch} />
      </ScrollView>
      <BottomNav active="search" onChange={onTab} />
      <HomeIndicator />
    </View>
  );
}

const MAP_STREETS = [
  { left: 127.5, top: 150, width: 286, height: 5, rotate: '-3deg' },
  { left: 120, top: 177, width: 289, height: 5, rotate: '4deg' },
  { left: 135.5, top: 348, width: 266, height: 5, rotate: '-5deg' },
  { left: 99, top: 447, width: 330, height: 5, rotate: '3deg' },
  { left: 183, top: 82, width: 5, height: 458, rotate: '2deg' },
  { left: 278, top: 38, width: 5, height: 504, rotate: '-3deg' },
];

const MAP_PINS = [
  { left: 141, top: 217, label: '$240' },
  { left: 253, top: 169, label: '$210' },
  { left: 263, top: 312, label: '$185' },
  { left: 155, top: 449, label: '$165' },
];

function ElNidoMap({ controlsTop = 474 }) {
  return (
    <View style={styles.mapCanvas}>
      <View style={styles.coastline} />
      {MAP_STREETS.map((s, i) => (
        <View
          key={i}
          style={{
            position: 'absolute',
            left: s.left,
            top: s.top,
            width: s.width,
            height: s.height,
            borderRadius: 3,
            backgroundColor: 'rgba(121, 13, 22, 0.12)',
            transform: [{ rotate: s.rotate }],
          }}
        />
      ))}
      <T size={11} weight="400" style={{ position: 'absolute', left: 215, top: 123 }}>
        EL NIDO
      </T>
      <T
        size={18}
        weight="400"
        face="serif"
        italic
        style={{ position: 'absolute', left: 18, top: 258 }}
      >
        Bacuit Bay
      </T>
      <T size={10} weight="400" style={{ position: 'absolute', left: 146, top: 385 }}>
        Corong Corong Beach
      </T>

      {MAP_PINS.map((p) => (
        <View key={p.label} style={[styles.pricePin, { left: p.left, top: p.top }]}>
          <T size={12} weight="600" color={C.cream}>
            {p.label}
          </T>
        </View>
      ))}

      <View style={styles.mapMarker} />

      <View style={[styles.mapControls, { top: controlsTop }]}>
        <Icon name="locate-fixed" size={20} />
      </View>
    </View>
  );
}

function MapViewScreen({ onBack, onTab, onHotel }) {
  return (
    <View style={styles.lightScreen}>
      <StatusBarMock />
      <View style={{ flex: 1 }}>
        <ElNidoMap />

        <View style={styles.mapSearchCard}>
          <TextField label="Your destination" value="El Nido · 12–15 Nov · 2 guests" icon="search" />
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {['Filters', 'Under $250', '4.5+ stars'].map((chip) => (
              <View key={chip} style={styles.chip}>
                <T size={10} weight="600">
                  {chip}
                </T>
              </View>
            ))}
          </View>
        </View>

        <TouchableOpacity activeOpacity={0.9} style={styles.resultsSwitcher} onPress={onHotel}>
          <Icon name="list" size={18} color={C.cream} />
          <T size={12} weight="600" color={C.cream}>
            12 stays · View list
          </T>
        </TouchableOpacity>
      </View>
      <BottomNav active="search" onChange={onTab} />
      <HomeIndicator />
    </View>
  );
}

const AMENITIES = [
  { icon: 'wifi', label: 'Wi-Fi' },
  { icon: 'waves', label: 'Pool' },
  { icon: 'coffee', label: 'Breakfast' },
  { icon: 'car', label: 'Parking' },
  { icon: 'flower', label: 'Spa' },
  { icon: 'dumbbell', label: 'Gym' },
];

const HOTELS = [
  { name: 'The Cove El Nido', rating: '4.9', price: 240, image: IMG.cove },
  { name: 'Casa Palma', rating: '4.8', price: 185, image: IMG.palma },
  { name: 'The Atelier', rating: '4.9', price: 210, image: IMG.atelier },
  { name: 'Amihan House', rating: '4.7', price: 165, image: IMG.amihan },
];

const ROOMS = [
  {
    name: 'Ocean King Suite',
    detail: '1 king bed · 42 m² · Ocean-view balcony',
    price: 240,
    image: IMG.oceanKing,
  },
  {
    name: 'Garden Twin Room',
    detail: '2 twin beds · 34 m² · Private garden terrace',
    price: 185,
    image: IMG.gardenTwin,
  },
];

function Rating({ value = '4.9 (128)', size = 13 }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
      <Icon name="star" size={size} />
      <T size={11} weight="600">
        {value}
      </T>
    </View>
  );
}

function NightlyPrice({ price, size = 20, align = 'flex-start' }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 4, justifyContent: align }}>
      <T size={size} weight="700">
        {`$${price}`}
      </T>
      <T size={10}>/ night</T>
    </View>
  );
}

function SummaryRow({ label, value, labelSize = 13, valueSize = 13, labelWeight = '400', valueWeight = '500' }) {
  return (
    <View style={styles.spreadRow}>
      <T size={labelSize} weight={labelWeight}>
        {label}
      </T>
      <T size={valueSize} weight={valueWeight}>
        {value}
      </T>
    </View>
  );
}

function Chip({ label, active, onPress, height, paddingVertical = 8, paddingHorizontal = 12, style }) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[
        styles.chipBase,
        {
          height,
          paddingVertical: height ? 0 : paddingVertical,
          paddingHorizontal: height ? 0 : paddingHorizontal,
          backgroundColor: active ? C.burgundy : C.cream,
          borderColor: C.line,
        },
        style,
      ]}
    >
      <T size={10} weight="600" color={active ? C.cream : C.burgundy}>
        {label}
      </T>
    </TouchableOpacity>
  );
}

function SettingRow({ icon, label, height = 36, chevron = true, onPress }) {
  const Wrapper = onPress ? TouchableOpacity : View;
  return (
    <Wrapper
      onPress={onPress}
      activeOpacity={0.85}
      style={[styles.settingRow, { height }]}
    >
      <Icon name={icon} size={18} />
      <T size={11} weight="500" style={{ flex: 1 }}>
        {label}
      </T>
      {chevron ? <Icon name="chevron-right" size={14} /> : null}
    </Wrapper>
  );
}

function HotelCard({ hotel, onPress, onDelete }) {
  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={styles.hotelCard}>
      <Image
        source={IMG[hotel.image_key] ?? IMG.cove}
        style={styles.hotelCardPhoto}
        resizeMode="cover"
      />
      <TouchableOpacity
        onPress={onDelete}
        hitSlop={8}
        style={{
          position: 'absolute',
          top: 6,
          right: 6,
          width: 24,
          height: 24,
          borderRadius: 12,
          backgroundColor: C.cream,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <T size={11} weight="700">
          {'\u2715'}
        </T>
      </TouchableOpacity>
      <View style={styles.hotelCardInfo}>
        <T size={14} weight="600" face="serif">
          {hotel.name}
        </T>
        <View style={styles.spreadRow}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
            <Icon name="star" size={10} />
            <T size={9} weight="400">
              {hotel.rating}
            </T>
          </View>
          <View style={styles.priceTag}>
            <T size={9} weight="600">{`$${hotel.price} / night`}</T>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function MapHotelDetailScreen({ onBack, onTab, onViewHotel }) {
  return (
    <View style={styles.lightScreen}>
      <StatusBarMock />
      <View style={{ flex: 1 }}>
        <ElNidoMap controlsTop={348} />

        <View style={{ position: 'absolute', left: 24, right: 24, top: 16 }}>
          <TextField label="Your destination" value="El Nido · 12–15 Nov · 2 guests" icon="search" />
        </View>

        <View style={styles.previewCard}>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <Image source={IMG.mapThumb} style={styles.previewPhoto} resizeMode="cover" />
            <View style={{ flex: 1, gap: 6 }}>
              <T size={21} weight="600" face="serif">
                The Cove El Nido
              </T>
              <T size={10} lineHeight={15}>
                Beachfront · El Nido
              </T>
              <Rating />
              <NightlyPrice price={240} size={14} />
            </View>
          </View>
          <T size={11} lineHeight={16.5}>
            Ocean views, slow mornings and a pool{'\n'}worth staying in for.
          </T>
          <Button label="View Hotel" onPress={onViewHotel} />
        </View>
      </View>
      <BottomNav active="search" onChange={onTab} />
      <HomeIndicator />
    </View>
  );
}

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(121, 13, 22, 0.72)',
    justifyContent: 'center',
    padding: 24,
  },
  card: { backgroundColor: C.cream, borderRadius: 24, padding: 20, gap: 12 },
  input: {
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 48,
    color: C.burgundy,
    fontSize: 13,
  },
});

function HomeScreen({ onTab, onHotel }) {
  const [category, setCategory] = useState('Resorts');
  const [hotels, setHotels] = useState([]);
  const [search, setSearch] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [rating, setRating] = useState('');

  const loadHotels = (query = '') => {
    if (query.trim() === '') {
      setHotels(db.getAllSync('SELECT * FROM hotels ORDER BY id DESC;'));
    } else {
      setHotels(
        db.getAllSync('SELECT * FROM hotels WHERE name LIKE ? ORDER BY name ASC;', [`%${query}%`])
      );
    }
  };

  useEffect(() => {
    initDatabase();
    loadHotels();
  }, []);

  const handleAdd = () => {
    const p = parseFloat(price);
    const r = parseFloat(rating);
    if (!name.trim() || isNaN(p) || isNaN(r)) {
      Alert.alert('Validation Error', 'Please fill in all hotel fields.');
      return;
    }
    db.runSync(
      'INSERT INTO hotels (name, category, price, rating, image_key) VALUES (?, ?, ?, ?, ?);',
      [name.trim(), category, p, r, 'cove']
    );
    setName('');
    setPrice('');
    setRating('');
    setModalVisible(false);
    loadHotels(search);
  };

  const handleDelete = (id, hotelName) => {
    Alert.alert('Delete Confirmation', `Remove ${hotelName}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          db.runSync('DELETE FROM hotels WHERE id = ?;', [id]);
          loadHotels(search);
        },
      },
    ]);
  };

  const header = (
    <View style={{ gap: 8, paddingBottom: 8 }}>
      <View style={styles.spreadRow}>
        <View style={{ gap: 2 }}>
          <T size={28} weight="400" face="serif">
            Stayly.
          </T>
          <T size={9} weight="400">
            Good morning, Sofia
          </T>
        </View>
        <TouchableOpacity activeOpacity={0.85} hitSlop={10}>
          <Icon name="bell" size={20} />
        </TouchableOpacity>
      </View>

      <View style={[styles.textField, { height: 44 }]}>
        <TextInput
          style={{ flex: 1, fontSize: 13, color: C.burgundy }}
          placeholder="Search hotels by name (SQL LIKE)..."
          placeholderTextColor="rgba(121, 13, 22, 0.5)"
          value={search}
          onChangeText={(text) => {
            setSearch(text);
            loadHotels(text);
          }}
        />
        <Icon name="search" size={18} />
      </View>

      <TouchableOpacity activeOpacity={0.9} style={styles.promoBanner}>
        <View style={{ gap: 3 }}>
          <T size={20} weight="600" face="serif">
            Save up to 40%
          </T>
          <T size={9} weight="400">
            Beautiful stays. Even better prices.
          </T>
        </View>
        <Icon name="arrow-up-right" size={24} />
      </TouchableOpacity>

      <View style={{ flexDirection: 'row', gap: 8 }}>
        {['Resorts', 'City', 'Beach', 'Boutique'].map((item) => (
          <Chip
            key={item}
            label={item}
            active={category === item}
            onPress={() => setCategory(item)}
            paddingVertical={0}
            paddingHorizontal={10}
          />
        ))}
      </View>

      <View style={styles.spreadRow}>
        <T size={20} weight="600" face="serif">
          Handpicked for you
        </T>
        <TouchableOpacity activeOpacity={0.85} onPress={() => setModalVisible(true)}>
          <T size={11} weight="700">
            + Add Hotel
          </T>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.lightScreen}>
      <StatusBarMock />
      <FlatList
        data={hotels}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        columnWrapperStyle={{ gap: 8, marginBottom: 8 }}
        contentContainerStyle={styles.discoverContent}
        ListHeaderComponent={header}
        renderItem={({ item }) => (
          <View style={{ flex: 1, maxWidth: '50%' }}>
            <HotelCard
              hotel={item}
              onPress={() => onHotel(item)}
              onDelete={() => handleDelete(item.id, item.name)}
            />
          </View>
        )}
        ListEmptyComponent={
          <T size={12} style={{ textAlign: 'center', marginTop: 24 }}>
            No hotels found in SQLite database.
          </T>
        }
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      />
      <BottomNav active="home" onChange={onTab} />
      <HomeIndicator />

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={modalStyles.overlay}>
          <View style={modalStyles.card}>
            <T size={24} weight="400" face="serif">
              New Hotel Entry
            </T>
            <TextInput
              style={modalStyles.input}
              placeholder="Hotel name"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={modalStyles.input}
              placeholder="Price per night (USD)"
              keyboardType="numeric"
              value={price}
              onChangeText={setPrice}
            />
            <TextInput
              style={modalStyles.input}
              placeholder="Rating (e.g. 4.8)"
              keyboardType="numeric"
              value={rating}
              onChangeText={setRating}
            />
            <T size={10}>Category: {category} (pili sa chips sa Home)</T>
            <Button label="Save to SQLite" onPress={handleAdd} />
            <Button label="Cancel" variant="light" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

function HotelDetailsScreen({ hotel, onBack, onTab, onSelectRoom }) {
  const h = hotel ?? { name: 'The Cove El Nido', price: 240, rating: 4.9, image_key: 'cove' };
  const heroSource =
    !IMG[h.image_key] || h.image_key === 'cove' ? IMG.detailHero : IMG[h.image_key];

  return (
    <View style={styles.lightScreen}>
      <StatusBarMock />
      <View style={{ height: 212 }}>
        <Image source={heroSource} style={styles.heroImage} resizeMode="cover" />
        <TouchableOpacity activeOpacity={0.9} style={[styles.circleControl, { left: 24, top: 16 }]} onPress={onBack}>
          <Icon name="arrow-left" size={18} />
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.9} style={[styles.circleControl, { right: 24, top: 16 }]}>
          <Icon name="heart" size={18} />
        </TouchableOpacity>
        <View style={styles.dealBadge}>
          <T size={10} weight="600">
            Deal · Breakfast included
          </T>
        </View>
        <View style={styles.photoCount}>
          <T size={10} weight="400" color={C.cream}>
            1 / 8
          </T>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.detailsContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ gap: 4 }}>
          <T size={27} weight="600" lineHeight={31.9} face="serif">
            {h.name}
          </T>
          <T size={11} lineHeight={16.5}>
            El Nido, Philippines
          </T>
          <Rating value={`${h.rating} (128)`} />
        </View>

        <View style={{ flexDirection: 'row', gap: 4 }}>
          {AMENITIES.map((item) => (
            <View key={item.label} style={styles.amenityTile}>
              <Icon name={item.icon} size={20} />
              <T size={7} weight="500">
                {item.label}
              </T>
            </View>
          ))}
        </View>

        <T size={12} lineHeight={18}>
          Wake to island views and drift into slow days. Our intimate beachfront hideaway pairs
          thoughtful suites with local flavours and warm Filipino hospitality.
        </T>

        <View style={styles.spreadRow}>
          <T size={11} weight="600" style={{ textDecorationLine: 'underline' }}>
            Reviews · 128 guest stories
          </T>
          <Icon name="arrow-right" size={16} />
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          <View style={{ width: 132 }}>
            <NightlyPrice price={h.price} size={20} />
          </View>
          <View style={{ flex: 1 }}>
            <Button label="Select Room" onPress={onSelectRoom} />
          </View>
        </View>

        <T size={9} lineHeight={13.5} style={{ textAlign: 'center' }}>
          Free cancellation · No booking surprises
        </T>
      </ScrollView>
      <BottomNav active="home" onChange={onTab} />
      <HomeIndicator />
    </View>
  );
}

function RoomSelectionScreen({ onBack, onSelect }) {
  return (
    <View style={styles.lightScreen}>
      <StatusBarMock />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.contentGap16}
        showsVerticalScrollIndicator={false}
      >
        <PageHeading title="Your room awaits" onBack={onBack} />
        <T size={12} lineHeight={18}>
          12–15 Nov 2026 · 2 adults · 1 room
        </T>

        {ROOMS.map((room) => (
          <View key={room.name} style={styles.roomCard}>
            <Image source={room.image} style={styles.roomPhoto} resizeMode="cover" />
            <View style={styles.roomInfo}>
              <T size={21} weight="600" face="serif">
                {room.name}
              </T>
              <T size={10} lineHeight={15}>
                {room.detail}
              </T>
              <T size={10} lineHeight={15}>
                Free cancellation before 5 Nov
              </T>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 24 }}>
                <View style={{ width: 172 }}>
                  <NightlyPrice price={room.price} size={20} />
                </View>
                <View style={{ flex: 1 }}>
                  <Button label="Select" height={40} onPress={onSelect} />
                </View>
              </View>
            </View>
          </View>
        ))}

        <T size={10} lineHeight={15} style={{ textAlign: 'center' }}>
          All rooms include breakfast for two.
        </T>
      </ScrollView>
      <HomeIndicator />
    </View>
  );
}

function BookingSummaryScreen({ onBack, onContinue }) {
  return (
    <View style={styles.lightScreen}>
      <StatusBarMock />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.contentGap24}
        showsVerticalScrollIndicator={false}
      >
        <PageHeading title="Your stay, at a glance" onBack={onBack} />

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          <Image source={IMG.summary} style={styles.summaryPhoto} resizeMode="cover" />
          <View style={{ flex: 1, gap: 4 }}>
            <T size={20} weight="600" lineHeight={23.6} face="serif">
              The Cove El Nido
            </T>
            <T size={11} lineHeight={16.5}>
              Ocean King Suite · 1 king bed
            </T>
            <Rating />
          </View>
        </View>

        <View style={styles.infoCard}>
          <SummaryRow label="Check-in" value="12 Nov 2026" />
          <SummaryRow label="Check-out" value="15 Nov 2026" />
          <SummaryRow label="Guests & rooms" value="2 adults · 1 room" />
        </View>

        <View style={{ gap: 12 }}>
          <T size={22} weight="600" face="serif">
            Price details
          </T>
          <SummaryRow label="$240 × 3 nights" value="$720.00" />
          <SummaryRow label="Taxes (10%)" value="$72.00" />
          <SummaryRow label="Service fee" value="$18.00" />
          <View style={styles.divider} />
          <SummaryRow label="Total · USD" value="$810.00" valueWeight="700" />
        </View>

        <TextField label="Have a promo code?" value="Enter code" icon="ticket" />

        <Button label="Continue" onPress={onContinue} />

        <T size={10} lineHeight={15} style={{ textAlign: 'center' }}>
          Breakfast included · Free cancellation before 5 Nov
        </T>
      </ScrollView>
      <HomeIndicator />
    </View>
  );
}

const PAYMENT_METHODS = [
  { key: 'Card', icon: 'credit-card' },
  { key: 'PayPal', icon: 'wallet' },
  { key: 'Apple Pay', icon: 'smartphone' },
  { key: 'Google Pay', icon: 'wallet-cards' },
];

function PaymentOption({ option, selected, onPress }) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={[styles.paymentOption, selected && styles.paymentOptionSelected]}
    >
      <Icon name={option.icon} size={18} />
      <T size={12} weight="500" style={{ flex: 1 }}>
        {option.key}
      </T>
      <View style={[styles.radio, selected && styles.radioSelected]}>
        {selected ? <View style={styles.radioDot} /> : null}
      </View>
    </TouchableOpacity>
  );
}

function GuestPaymentScreen({ onBack, onConfirm }) {
  const [method, setMethod] = useState('Card');
  return (
    <View style={styles.lightScreen}>
      <StatusBarMock />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.contentGap16}
        showsVerticalScrollIndicator={false}
      >
        <PageHeading title="Guest & payment" onBack={onBack} />

        <View style={{ gap: 8 }}>
          <T size={22} weight="400" face="serif">
            Who&apos;s checking in?
          </T>
          <TextField label="Guest name" value="Sofia Reyes" height={48} />
          <TextField label="Email address" value="sofia.reyes@email.com" height={48} />
          <TextField label="Phone number" value="+63 917 246 0810" height={48} />
        </View>

        <View style={{ gap: 8 }}>
          <T size={22} weight="400" face="serif">
            How would you like to pay?
          </T>
          {PAYMENT_METHODS.map((option) => (
            <PaymentOption
              key={option.key}
              option={option}
              selected={method === option.key}
              onPress={() => setMethod(option.key)}
            />
          ))}
        </View>

        <SummaryRow label="Total · 3 nights" value="$810.00 USD" labelWeight="600" valueWeight="700" />

        <Button label="Confirm Booking" onPress={onConfirm} />

        <T size={9} lineHeight={13.5} style={{ textAlign: 'center' }}>
          Your payment is encrypted and secure.{'\n'}By continuing, you agree to our booking terms.
        </T>
      </ScrollView>
      <HomeIndicator />
    </View>
  );
}

function CardPaymentScreen({ onBack, onPay }) {
  return (
    <View style={styles.lightScreen}>
      <StatusBarMock />
      <View style={{ flex: 1 }}>
        <View style={[styles.dimmedContent, { opacity: 0.55 }]}>
          <PageHeading title="Guest & payment" onBack={onBack} />
          <T size={13} weight="600" lineHeight={19.5}>
            Who&apos;s checking in?
          </T>
          <TextField label="Guest name" value="Sofia Reyes" />
          <TextField label="Email address" value="sofia.reyes@email.com" />
          <TextField label="Phone number" value="+63 917 246 0810" />
          <T size={13} weight="600" lineHeight={19.5}>
            Payment method · Card
          </T>
          <SummaryRow label="Total · USD" value="$810.00" />
          <Button label="Confirm Booking" onPress={() => {}} />
        </View>

        <View style={styles.modalBackdrop} />

        <View style={styles.modalCard}>
          <View style={styles.spreadRow}>
            <T size={27} weight="400" face="serif">
              Card payment
            </T>
            <TouchableOpacity activeOpacity={0.85} onPress={onBack}>
              <Icon name="x" size={18} />
            </TouchableOpacity>
          </View>

          <View style={styles.cardIllustration}>
            <View style={styles.cardFlourish} />
            <View style={styles.spreadRow}>
              <T size={18} weight="400" face="serif" color={C.cream}>
                Stayly.
              </T>
              <View style={styles.cardChip} />
            </View>
            <T size={15} weight="400" color={C.cream}>
              •••• •••• •••• 4242
            </T>
            <View style={styles.spreadRow}>
              <T size={9} weight="400" color={C.cream}>
                SOFIA REYES
              </T>
              <T size={9} weight="400" color={C.cream}>
                08 / 29
              </T>
            </View>
          </View>

          <TextField label="Card number" value="4242 4242 4242 4242" icon="credit-card" height={48} />

          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TextField label="Expiry date" value="08 / 29" height={48} style={{ flex: 1 }} />
            <TextField label="CVV" value="•••" icon="lock-keyhole" height={48} style={{ flex: 1 }} />
          </View>

          <SummaryRow label="Total to pay" value="$810.00 USD" labelWeight="600" valueWeight="700" />

          <Button label="Pay Now" onPress={onPay} />

          <T size={9} lineHeight={13.5} style={{ textAlign: 'center' }}>
            Secure payment. Peace of mind included.
          </T>
        </View>
      </View>
      <HomeIndicator />
    </View>
  );
}

const BOOKING_STEPS = [
  { title: 'Booked', sub: 'Confirmed · your room is reserved', done: true },
  { title: 'Checked in', sub: '12 Nov · from 3:00 PM', done: false },
  { title: 'Checked out', sub: '15 Nov · by 11:00 AM', done: false },
];

function BookingsScreen({ onBack, onTab, onView }) {
  const [tab, setTab] = useState('Upcoming');
  return (
    <View style={styles.lightScreen}>
      <StatusBarMock />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.contentGap16}
        showsVerticalScrollIndicator={false}
      >
        <PageHeading title="My bookings" onBack={onBack} />

        <View style={{ flexDirection: 'row', gap: 8 }}>
          {['Upcoming', 'Completed', 'Cancelled'].map((item) => (
            <View key={item} style={{ flex: 1 }}>
              <Chip
                label={item}
                active={tab === item}
                onPress={() => setTab(item)}
                height={36}
              />
            </View>
          ))}
        </View>

        <View style={styles.upcomingCard}>
          <Image source={IMG.bookingUpcoming} style={styles.upcomingPhoto} resizeMode="cover" />
          <View style={styles.bookingInfo}>
            <T size={22} weight="600" lineHeight={26} face="serif">
              The Cove El Nido
            </T>
            <T size={10} lineHeight={15}>
              Ocean King Suite · 2 adults · 3 nights
            </T>
            <View style={styles.spreadRow}>
              <T size={10} weight="600">
                12–15 Nov 2026
              </T>
              <T size={10} weight="600">
                Paid $810.00
              </T>
            </View>
            <T size={9} lineHeight={13.5}>
              Reference STY-261112 · View booking →
            </T>

            <View style={{ gap: 0 }}>
              {BOOKING_STEPS.map((step, i) => (
                <View key={step.title} style={styles.statusStep}>
                  <View style={styles.stepMarker}>
                    {i < BOOKING_STEPS.length - 1 ? <View style={styles.stepConnector} /> : null}
                    <View style={[styles.statusCircle, !step.done && styles.statusCircleIdle]} />
                  </View>
                  <View style={{ flex: 1, gap: 2 }}>
                    <T size={11} weight={step.done ? '700' : '500'}>
                      {step.title}
                    </T>
                    <T size={9} weight="400">
                      {step.sub}
                    </T>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>

        <T size={11} weight="600" lineHeight={16.5}>
          A place you&apos;ve loved before
        </T>

        <TouchableOpacity activeOpacity={0.9} style={styles.pastCard} onPress={onView}>
          <Image source={IMG.bookingPast} style={styles.pastPhoto} resizeMode="cover" />
          <View style={{ flex: 1, gap: 4 }}>
            <T size={17} weight="600" lineHeight={20} face="serif">
              The Cove El Nido
            </T>
            <T size={9} lineHeight={13.5}>
              20–22 Aug 2026 · Completed
            </T>
            <T size={9} weight="600" lineHeight={13.5}>
              Book again →
            </T>
          </View>
        </TouchableOpacity>
      </ScrollView>
      <BottomNav active="bookings" onChange={onTab} />
      <HomeIndicator />
    </View>
  );
}

const LANGUAGES = ['English', 'Filipino', 'Spanish'];

function ProfileScreen({ onBack, onTab }) {
  const [language, setLanguage] = useState('English');
  const [languageOpen, setLanguageOpen] = useState(false);
  return (
    <View style={styles.lightScreen}>
      <StatusBarMock />
      <View style={{ flex: 1 }}>
        <View style={styles.accountActions}>
          <SettingRow icon="user-round" label="Personal information" />
          <SettingRow icon="shield-check" label="Security" />
          <Button label="Edit Profile" height={40} onPress={() => {}} />
          <T size={11} weight="600" lineHeight={16.5} style={{ textAlign: 'center' }}>
            Log Out
          </T>
        </View>

        <View style={styles.profileContent}>
          <PageHeading title="Your profile" onBack={onBack} />

          <View style={{ alignItems: 'center' }}>
            <Image source={IMG.avatar} style={styles.avatar} resizeMode="cover" />
          </View>

          <View style={{ alignItems: 'center', gap: 4 }}>
            <T size={26} weight="400" face="serif">
              Sofia Reyes
            </T>
            <T size={11} weight="400">
              sofia.reyes@email.com
            </T>
          </View>

          <View style={{ gap: 8 }}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => setLanguageOpen(true)}
              style={styles.languageSetting}
            >
              <Icon name="globe" size={18} />
              <View style={{ flex: 1, gap: 2 }}>
                <T size={11} weight="400">
                  Language
                </T>
                <T size={10} weight="400">
                  {language}
                </T>
              </View>
              <Icon name="chevron-down" size={14} />
            </TouchableOpacity>
          </View>
        </View>

        {languageOpen ? (
          <>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => setLanguageOpen(false)}
              style={styles.languageScrim}
            />

            <View style={styles.languageDropdown}>
              <View style={styles.spreadRow}>
                <T size={24} weight="400" face="serif">
                  Language
                </T>
                <Icon name="chevron-up" size={18} />
              </View>
              {LANGUAGES.map((item) => (
                <TouchableOpacity
                  key={item}
                  activeOpacity={0.9}
                  onPress={() => {
                    setLanguage(item);
                    setLanguageOpen(false);
                  }}
                  style={[styles.languageOption, language === item && styles.languageOptionActive]}
                >
                  <T size={12} weight={language === item ? '600' : '400'}>
                    {item}
                  </T>
                  {language === item ? <Icon name="check" size={18} /> : null}
                </TouchableOpacity>
              ))}
            </View>
          </>
        ) : null}
      </View>
      <BottomNav active="profile" onChange={onTab} />
      <HomeIndicator />
    </View>
  );
}

function BookingConfirmedScreen({ onViewBooking, onHome }) {
  return (
    <View style={styles.darkScreen}>
      <StatusBarMock dark />
      <View style={{ height: 220 }}>
        <Image source={IMG.confirmedHero} style={styles.heroImage} resizeMode="cover" />
        <Wave height={46} />
      </View>
      <View style={styles.confirmationPanel}>
        <Icon name="circle-check" size={36} color={C.cream} />
        <T size={32} weight="600" lineHeight={37.8} face="serif" color={C.cream}>
          Thank You, your stay is booked
        </T>
        <T size={11} lineHeight={16.5} color={C.cream}>
          Your little escape is all set. Confirmation sent to sofia.reyes@email.com.
        </T>
        <View style={{ gap: 6, paddingVertical: 8 }}>
          <T size={10} weight="600" color={C.cream}>
            BOOKING REF. STY-261112
          </T>
          <T size={12} weight="600" lineHeight={18} color={C.cream}>
            The Cove El Nido
          </T>
          <T size={10} lineHeight={15} color={C.cream}>
            12–15 Nov 2026 · Ocean King Suite{'\n'}2 adults · 3 nights · Paid $810.00 USD
          </T>
        </View>
        <Button label="View Booking" variant="light" onPress={onViewBooking} />
        <TouchableOpacity activeOpacity={0.9} style={styles.ghostButton} onPress={onHome}>
          <T size={13} weight="600" color={C.cream}>
            Home
          </T>
        </TouchableOpacity>
      </View>
      <HomeIndicator dark />
    </View>
  );
}

export default function App() {
  const [stack, setStack] = useState(['splash']);
    const [selectedHotel, setSelectedHotel] = useState(null);

  const top = stack[stack.length - 1];
  const push = (name) => setStack((s) => [...s, name]);
  const pop = () => setStack((s) => (s.length > 1 ? s.slice(0, -1) : s));
  const replace = (name) => setStack((s) => [...s.slice(0, -1), name]);
  const goTab = (key) => setStack([key]);

  const screens = {
    splash: <SplashScreen onNext={() => push('login')} />,
    login: (
      <LoginScreen onNext={() => push('home')} onSignUp={() => push('signup')} />
    ),
    signup: (
      <SignUpScreen onCreate={() => replace('home')} onLogIn={() => replace('login')} />
    ),
    home: (
      <HomeScreen
        onTab={goTab}
        onHotel={(h) => {
          setSelectedHotel(h);
          push('hotel');
        }}
      />
    ),
    search: (
      <SearchHotelsScreen onBack={pop} onSearch={() => push('map')} onTab={goTab} />
    ),
    map: (
      <MapViewScreen onBack={pop} onTab={goTab} onHotel={() => push('maphotel')} />
    ),
    maphotel: (
      <MapHotelDetailScreen onBack={pop} onTab={goTab} onViewHotel={() => push('hotel')} />
    ),
    hotel: (
      <HotelDetailsScreen
        hotel={selectedHotel}
        onBack={pop}
        onTab={goTab}
        onSelectRoom={() => push('rooms')}
      />
    ),
    rooms: <RoomSelectionScreen onBack={pop} onSelect={() => push('summary')} />,
    summary: <BookingSummaryScreen onBack={pop} onContinue={() => push('payment')} />,
    payment: <GuestPaymentScreen onBack={pop} onConfirm={() => push('card')} />,
    card: <CardPaymentScreen onBack={pop} onPay={() => push('confirmed')} />,
    confirmed: (
      <BookingConfirmedScreen onViewBooking={() => goTab('bookings')} onHome={() => goTab('home')} />
    ),
    bookings: (
      <BookingsScreen onBack={pop} onTab={goTab} onView={() => push('hotel')} />
    ),
    profile: <ProfileScreen onBack={pop} onTab={goTab} />,
  };

  return (
    <View style={styles.appRoot}>
      <View style={styles.appViewport}>
        {screens[top] ?? screens.splash}
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  appRoot: {
    flex: 1,
    backgroundColor: C.cream,
  },
  appViewport: {
    flex: 1,
    width: '100%',
    maxWidth: 430,
    alignSelf: 'center',
    overflow: 'hidden',
  },

  lightScreen: {
    flex: 1,
    width: '100%',
    backgroundColor: C.cream,
  },
  darkScreen: {
    flex: 1,
    width: '100%',
    backgroundColor: C.burgundy,
  },

  statusBar: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    paddingHorizontal: 24,
  },
  homeIndicatorArea: {
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },

  heroImage: {
    ...StyleSheet.absoluteFillObject,
    width: undefined,
    height: undefined,
  },
  wave: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },

  welcomePanel: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 24,
    paddingBottom: 16,
    gap: 24,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 4,
    backgroundColor: C.cream,
    opacity: 0.4,
  },

  contentGap16: {
    flexGrow: 1,
    width: '100%',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
    gap: 16,
  },
  contentGap24: {
    flexGrow: 1,
    width: '100%',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
    gap: 24,
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },

  button: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    borderWidth: 1,
  },
  socialButton: {
    flex: 1,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.line,
  },

  textField: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.line,
    backgroundColor: C.cream,
  },

  spreadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  toggle: {
    width: 32,
    height: 18,
    padding: 3,
    borderRadius: 20,
    backgroundColor: C.burgundy,
    alignItems: 'flex-end',
  },
  toggleOff: {
    backgroundColor: C.line,
    alignItems: 'flex-start',
  },
  toggleThumb: {
    width: 12,
    height: 12,
    borderRadius: 12,
    backgroundColor: C.cream,
  },
  toggleThumbOff: {
    backgroundColor: C.burgundy,
  },

  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    backgroundColor: C.burgundy,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxOff: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: C.line,
  },

  dateRange: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 16,
    backgroundColor: C.gold,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.line,
  },

  bottomNav: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    paddingHorizontal: 24,
    backgroundColor: C.cream,
    borderTopWidth: 1,
    borderTopColor: C.line,
  },
  navItem: {
    width: 68,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    borderRadius: 16,
    backgroundColor: C.cream,
  },
  navItemActive: {
    backgroundColor: C.soft,
  },

  mapCanvas: {
    width: 390,
    height: 560,
    alignSelf: 'center',
    backgroundColor: C.cream,
  },
  coastline: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 145,
    height: 560,
    backgroundColor: C.soft,
    borderTopRightRadius: 60,
    borderBottomRightRadius: 90,
  },
  pricePin: {
    position: 'absolute',
    width: 64,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: C.burgundy,
    shadowColor: C.burgundy,
    shadowOpacity: 0.16,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  mapMarker: {
    position: 'absolute',
    left: 162,
    top: 252,
    width: 20,
    height: 20,
    borderRadius: 20,
    backgroundColor: C.burgundy,
    borderWidth: 4,
    borderColor: C.cream,
  },
  mapControls: {
    position: 'absolute',
    left: 324,
    top: 474,
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: C.cream,
    borderWidth: 1,
    borderColor: C.line,
  },

  mapSearchCard: {
    position: 'absolute',
    left: 24,
    right: 24,
    top: 16,
    gap: 8,
    shadowColor: C.burgundy,
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: C.cream,
    borderWidth: 1,
    borderColor: C.line,
  },
  resultsSwitcher: {
    position: 'absolute',
    left: '50%',
    marginLeft: -95,
    bottom: 24,
    width: 190,
    height: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 16,
    backgroundColor: C.burgundy,
  },

  previewCard: {
    position: 'absolute',
    left: 16,
    right: 16,
    top: 364,
    padding: 16,
    gap: 12,
    borderRadius: 24,
    backgroundColor: C.cream,
    borderWidth: 1,
    borderColor: C.line,
    shadowColor: C.burgundy,
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  previewPhoto: {
    width: 110,
    height: 100,
    borderRadius: 16,
  },

  discoverContent: {
    flexGrow: 1,
    width: '100%',
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 16,
    gap: 8,
  },
  promoBanner: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: C.gold,
  },
  hotelCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.line,
    overflow: 'hidden',
  },
  hotelCardPhoto: {
    width: '100%',
    height: 72,
  },
  hotelCardInfo: {
    padding: 8,
    gap: 4,
  },
  priceTag: {
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: C.gold,
  },

  circleControl: {
    position: 'absolute',
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: C.cream,
  },
  dealBadge: {
    position: 'absolute',
    left: 24,
    top: 168,
    paddingHorizontal: 10,
    height: 26,
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: C.gold,
  },
  photoCount: {
    position: 'absolute',
    right: 24,
    top: 166,
    width: 62,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: C.burgundy,
  },

  detailsContent: {
    flexGrow: 1,
    width: '100%',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
    gap: 12,
  },
  amenityTile: {
    flex: 1,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: 16,
    backgroundColor: C.soft,
  },

  roomCard: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: C.line,
    backgroundColor: C.cream,
    overflow: 'hidden',
  },
  roomPhoto: {
    width: '100%',
    height: 100,
  },
  roomInfo: {
    padding: 12,
    gap: 8,
  },

  summaryPhoto: {
    width: 80,
    height: 88,
    borderRadius: 16,
  },
  infoCard: {
    padding: 16,
    gap: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.line,
  },
  divider: {
    height: 1,
    backgroundColor: C.line,
  },

  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    height: 40,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.line,
  },
  paymentOptionSelected: {
    borderColor: C.burgundy,
  },
  radio: {
    width: 16,
    height: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: C.burgundy,
    backgroundColor: C.cream,
  },
  radioSelected: {
    backgroundColor: C.burgundy,
  },
  radioDot: {
    width: 6,
    height: 6,
    borderRadius: 6,
    backgroundColor: C.cream,
  },

  dimmedContent: {
    position: 'absolute',
    left: 24,
    right: 24,
    top: 16,
    gap: 24,
  },
  profileContent: {
    position: 'absolute',
    left: 24,
    right: 24,
    top: 16,
    gap: 24,
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(121, 13, 22, 0.72)',
  },
  modalCard: {
    position: 'absolute',
    left: 16,
    right: 16,
    top: 86,
    padding: 20,
    gap: 16,
    borderRadius: 24,
    backgroundColor: C.cream,
    shadowColor: C.burgundy,
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  cardIllustration: {
    height: 112,
    padding: 16,
    gap: 8,
    borderRadius: 16,
    backgroundColor: C.burgundy,
  },
  cardFlourish: {
    position: 'absolute',
    right: -50,
    top: -20,
    width: 160,
    height: 170,
    borderRadius: 160,
    borderWidth: 1,
    borderColor: C.cream,
    opacity: 0.24,
  },
  cardChip: {
    width: 26,
    height: 20,
    borderRadius: 5,
    backgroundColor: C.gold,
  },

  chipBase: {
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.line,
    backgroundColor: C.cream,
  },

  upcomingCard: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: C.line,
    overflow: 'hidden',
  },
  upcomingPhoto: {
    width: '100%',
    height: 88,
  },
  bookingInfo: {
    padding: 16,
    gap: 8,
  },
  statusStep: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    height: 40,
  },
  stepMarker: {
    width: 18,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepConnector: {
    position: 'absolute',
    top: 22,
    left: 8.5,
    width: 1,
    height: 18,
    backgroundColor: C.line,
  },
  statusCircle: {
    width: 14,
    height: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.burgundy,
    backgroundColor: C.burgundy,
  },
  statusCircleIdle: {
    backgroundColor: C.cream,
  },
  pastCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.line,
  },
  pastPhoto: {
    width: 64,
    height: 60,
    borderRadius: 16,
  },

  avatar: {
    width: 64,
    height: 64,
    borderRadius: 51,
  },
  languageScrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(121, 13, 22, 0.5)',
  },
  languageSetting: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    height: 48,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.line,
  },
  languageDropdown: {
    position: 'absolute',
    left: 24,
    right: 24,
    top: 288,
    padding: 12,
    gap: 8,
    borderRadius: 24,
    backgroundColor: C.cream,
    shadowColor: C.burgundy,
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 28,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  languageOptionActive: {
    backgroundColor: C.soft,
  },
  accountActions: {
    position: 'absolute',
    left: 24,
    right: 24,
    top: 452,
    alignSelf: 'stretch',
    gap: 8,
    backgroundColor: C.cream,
  },

  confirmationPanel: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 24,
    paddingBottom: 16,
    gap: 12,
  },
  ghostButton: {
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.cream,
  },
});
