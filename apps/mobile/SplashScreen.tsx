import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Animated,
  Easing,
  TouchableOpacity,
} from 'react-native';
import { AdsspotLogoMarkNative } from './icons';





interface SplashScreenProps {
  onFinish?: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const scaleAnim = useRef(new Animated.Value(0.4)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const ringScaleAnim = useRef(new Animated.Value(0.8)).current;
  const textFadeAnim = useRef(new Animated.Value(0)).current;
  const textSlideAnim = useRef(new Animated.Value(20)).current;


  useEffect(() => {
    // 1. Logo Scale & Fade In
    Animated.parallel([
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    // 2. Pulse Ring
    Animated.loop(
      Animated.sequence([
        Animated.timing(ringScaleAnim, {
          toValue: 1.18,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(ringScaleAnim, {
          toValue: 1.0,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // 3. Text Fade & Slide Up
    Animated.sequence([
      Animated.delay(400),
      Animated.parallel([
        Animated.timing(textFadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(textSlideAnim, {
          toValue: 0,
          duration: 600,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // 4. Auto transition after 2.4s
    const timer = setTimeout(() => {
      if (onFinish) onFinish();
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      {/* Background Ambient Glow */}
      <View style={styles.ambientGlow} />

      {/* Center Animated Logo Cluster */}
      <View style={styles.logoCenter}>
        {/* Pulsing Spot Ring Aura */}
        <Animated.View
          style={[
            styles.ringAura,
            {
              transform: [{ scale: ringScaleAnim }],
            },
          ]}
        />

        {/* Main Logo Container */}
        <Animated.View
          style={[
            styles.logoWrapper,
            {
              opacity: opacityAnim,
              transform: [{ scale: scaleAnim }, { rotate: spin }],
            },
          ]}
        >
          <AdsspotLogoMarkNative size={68} />
        </Animated.View>


        {/* Brand Text Section */}
        <Animated.View
          style={[
            styles.textSection,
            {
              opacity: textFadeAnim,
              transform: [{ translateY: textSlideAnim }],
            },
          ]}
        >
          <Text style={styles.brandTitle}>
            <Text style={{ color: '#4787F2' }}>ADS</Text>
            <Text style={{ color: '#981837' }}>SPOT</Text>
          </Text>

          <View style={[styles.pillTag, { marginTop: 12 }]}>
            <View style={styles.liveDot} />
            <Text style={styles.pillText}>INDIA HYPERLOCAL DISCOVERY</Text>
          </View>



          <Text style={styles.tagline}>
            Explore shops, festival banners &amp; verified spots
          </Text>
        </Animated.View>
      </View>

      {/* Bottom Skip / Enter Button */}
      <TouchableOpacity
        style={styles.skipButton}
        activeOpacity={0.8}
        onPress={() => onFinish && onFinish()}
      >
        <Text style={styles.skipText}>Enter App →</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#17181C',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  ambientGlow: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: '#4787F2',
    opacity: 0.12,
    top: '30%',
  },
  logoCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringAura: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 3,
    borderColor: '#4787F2',
    opacity: 0.35,
    borderStyle: 'dashed',
  },
  logoWrapper: {
    width: 96,
    height: 96,
    borderRadius: 28,
    backgroundColor: '#26272B',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4787F2',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    borderWidth: 1.5,
    borderColor: '#32343A',
  },
  logoGeometry: {
    width: 64,
    height: 64,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  node: {
    position: 'absolute',
    width: 22,
    height: 22,
    borderRadius: 8,
  },
  nodeCrimson: {
    top: 4,
    backgroundColor: '#981837',
    borderWidth: 2,
    borderColor: '#FF4D6D',
  },
  nodeGreen: {
    right: 4,
    backgroundColor: '#35AB4E',
    borderWidth: 2,
    borderColor: '#5AE076',
  },
  nodeBlue: {
    bottom: 4,
    backgroundColor: '#4787F2',
    borderWidth: 2,
    borderColor: '#7AAEFF',
  },
  nodeYellow: {
    left: 4,
    backgroundColor: '#F2B604',
    borderWidth: 2,
    borderColor: '#FFD75E',
  },
  centerCore: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#17181C',
  },
  textSection: {
    alignItems: 'center',
    marginTop: 28,
  },
  brandTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -1,
  },
  pillTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#26272B',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 9999,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#32343A',
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#35AB4E',
  },
  pillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#F2B604',
    letterSpacing: 0.5,
  },
  tagline: {
    fontSize: 12,
    color: '#8A92A6',
    fontWeight: '500',
    marginTop: 8,
    textAlign: 'center',
    maxWidth: 240,
  },
  skipButton: {
    position: 'absolute',
    bottom: 40,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 9999,
    backgroundColor: '#26272B',
    borderWidth: 1,
    borderColor: '#4787F2',
  },
  skipText: {
    color: '#4787F2',
    fontSize: 12,
    fontWeight: '700',
  },
});
