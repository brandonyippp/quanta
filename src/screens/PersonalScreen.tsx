import React, { useState, useRef } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, Image, Animated, TouchableOpacity, Platform, Alert } from 'react-native';
import { Text, Card, FAB, Button, Surface } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSettings } from '../contexts/SettingsContext';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';

type RootStackParamList = {
  Main: undefined;
  AddApp: undefined;
  AppUsage: { card: AppCard };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type TimePeriod = 'daily' | 'weekly' | 'monthly';

interface AppCard {
  id: string;
  name: string;
  icon: string;
  timeUsed: number;
  timeLimit: number;
  color: string;
  logo?: string;
  category: string;
  timePeriod: TimePeriod;
}

interface Category {
  id: string;
  name: string;
  cards: AppCard[];
}

const PersonalScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const cardAnimations = useRef<{ [key: string]: Animated.Value }>({});
  const { settings: { swipeDirection, fabPosition } } = useSettings();
  const swipeableRefs = useRef<{ [key: string]: Swipeable | null }>({});
  const pressAnimations = useRef<{ [key: string]: Animated.Value }>({});
  const [categories, setCategories] = useState<Category[]>([
    {
      id: '1',
      name: 'Social Media',
      cards: [
        {
          id: '1',
          name: 'Instagram',
          icon: 'instagram',
          timeUsed: 45,
          timeLimit: 60,
          color: '#E1306C',
          logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Instagram_icon.png/2048px-Instagram_icon.png',
          category: 'Social Media',
          timePeriod: 'daily',
        },
        {
          id: '2',
          name: 'Twitter',
          icon: 'twitter',
          timeUsed: 30,
          timeLimit: 45,
          color: '#1DA1F2',
          logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Twitter-logo.svg/2491px-Twitter-logo.svg.png',
          category: 'Social Media',
          timePeriod: 'daily',
        },
        {
          id: '4',
          name: 'TikTok',
          icon: 'tiktok',
          timeUsed: 60,
          timeLimit: 90,
          color: '#000000',
          logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/a/a9/TikTok_logo.svg/1200px-TikTok_logo.svg.png',
          category: 'Social Media',
          timePeriod: 'daily',
        },
        {
          id: '5',
          name: 'Reddit',
          icon: 'reddit',
          timeUsed: 45,
          timeLimit: 60,
          color: '#FF4500',
          logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/8/82/Reddit_logo_and_wordmark.svg/1200px-Reddit_logo_and_wordmark.svg.png',
          category: 'Social Media',
          timePeriod: 'daily',
        },
      ],
    },
    {
      id: '2',
      name: 'Productivity',
      cards: [
        {
          id: '3',
          name: 'Slack',
          icon: 'slack',
          timeUsed: 120,
          timeLimit: 180,
          color: '#4A154B',
          logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Slack_icon_2019.svg/2048px-Slack_icon_2019.svg.png',
          category: 'Productivity',
          timePeriod: 'daily',
        },
      ],
    },
  ]);

  const formatTimeLeft = (timeUsed: number, timeLimit: number, timePeriod: TimePeriod) => {
    const timeLeft = timeLimit - timeUsed;
    const hours = Math.floor(timeLeft / 60);
    const minutes = timeLeft % 60;
    
    let periodText = '';
    switch (timePeriod) {
      case 'daily':
        periodText = 'today';
        break;
      case 'weekly':
        periodText = 'this week';
        break;
      case 'monthly':
        periodText = 'this month';
        break;
    }

    if (hours > 0) {
      return `${hours}h ${minutes}m left ${periodText}`;
    }
    return `${minutes}m left ${periodText}`;
  };

  const handleCardPress = (cardId: string) => {
    if (!pressAnimations.current[cardId]) {
      pressAnimations.current[cardId] = new Animated.Value(0);
    }

    // Create a jiggle animation sequence
    Animated.sequence([
      Animated.timing(pressAnimations.current[cardId], {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(pressAnimations.current[cardId], {
        toValue: -1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(pressAnimations.current[cardId], {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleSwipeOpen = (direction: 'left' | 'right', cardId: string) => {
    // Close all other swipeable refs
    Object.keys(swipeableRefs.current).forEach((key) => {
      if (key !== cardId && swipeableRefs.current[key]) {
        swipeableRefs.current[key]?.close();
      }
    });
  };

  const handleSwipeClose = (cardId: string) => {
    // Additional logic when swipe is closed
  };

  const handleUseCard = (card: AppCard) => {
    // Animate the card to the right
    const animation = Animated.sequence([
      Animated.timing(cardAnimations.current[card.id], {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(cardAnimations.current[card.id], {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]);

    animation.start(() => {
      // Close the swipeable
      swipeableRefs.current[card.id]?.close();
      // TODO: Open the app
      console.log('Opening app:', card.name);
    });
  };

  const handleDeleteCard = (card: AppCard) => {
    // Remove the Alert.alert and directly delete the card
    const updatedCategories = categories.map(category => ({
      ...category,
      cards: category.cards.filter(c => c.id !== card.id)
    }));
    setCategories(updatedCategories);
    swipeableRefs.current[card.id]?.close();
  };

  const renderRightActions = (progress: Animated.AnimatedInterpolation<number>, dragX: Animated.AnimatedInterpolation<number>, card: AppCard) => {
    const scale = dragX.interpolate({
      inputRange: [0, 100],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });

    const opacity = dragX.interpolate({
      inputRange: [0, 100],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });

    const translateX = dragX.interpolate({
      inputRange: [0, 100],
      outputRange: [-10, 0],
      extrapolate: 'clamp',
    });

    const iconTranslateX = dragX.interpolate({
      inputRange: [0, 100],
      outputRange: [-20, 0],
      extrapolate: 'clamp',
    });

    const iconTranslateY = dragX.interpolate({
      inputRange: [0, 100],
      outputRange: [30, 0],
      extrapolate: 'clamp',
    });

    return (
      <View style={styles.rightActionsContainer}>
        <Animated.View 
          style={[
            styles.rightActions,
            {
              opacity,
              transform: [
                { scale },
                { translateX }
              ],
            }
          ]}
        >
          <Animated.View 
            style={[
              styles.actionIconContainer,
              {
                transform: [
                  { translateX: iconTranslateX },
                  { translateY: iconTranslateY }
                ],
                opacity: dragX.interpolate({
                  inputRange: [0, 20, 100],
                  outputRange: [0, 0.5, 1],
                  extrapolate: 'clamp',
                }),
              }
            ]}
          >
            <MaterialCommunityIcons name="delete-outline" size={32} color="white" />
          </Animated.View>
          <View style={styles.confirmationButtons}>
            <TouchableOpacity
              style={[styles.confirmationButton, styles.confirmButton]}
              onPress={() => handleDeleteCard(card)}
            >
              <MaterialCommunityIcons name="check" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.confirmationButton, styles.cancelButton]}
              onPress={() => swipeableRefs.current[card.id]?.close()}
            >
              <MaterialCommunityIcons name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    );
  };

  const renderLeftActions = (progress: Animated.AnimatedInterpolation<number>, dragX: Animated.AnimatedInterpolation<number>, card: AppCard) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    const opacity = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    const translateX = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [0, -10],
      extrapolate: 'clamp',
    });

    const iconTranslateX = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [0, -20],
      extrapolate: 'clamp',
    });

    const iconTranslateY = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [0, 30],
      extrapolate: 'clamp',
    });

    return (
      <View style={styles.leftActionsContainer}>
        <Animated.View 
          style={[
            styles.leftActions,
            {
              opacity,
              transform: [
                { scale },
                { translateX }
              ],
            }
          ]}
        >
          <Animated.View 
            style={[
              styles.actionIconContainer,
              {
                transform: [
                  { translateX: iconTranslateX },
                  { translateY: iconTranslateY }
                ],
                opacity: dragX.interpolate({
                  inputRange: [-100, -20, 0],
                  outputRange: [1, 0.5, 0],
                  extrapolate: 'clamp',
                }),
              }
            ]}
          >
            <MaterialCommunityIcons name="credit-card-check-outline" size={32} color="white" />
            <MaterialCommunityIcons 
              name="airplane" 
              size={24} 
              color="white" 
              style={styles.airplaneIcon}
            />
          </Animated.View>
        </Animated.View>
      </View>
    );
  };

  const handleSwipeableOpen = (direction: 'left' | 'right', card: AppCard) => {
    // Close any other open swipeables immediately
    Object.entries(swipeableRefs.current).forEach(([id, ref]) => {
      if (id !== card.id && ref) {
        ref.close();
      }
    });

    // Handle the swipe action
    if (direction === 'right') {
      if (swipeDirection === 'normal') {
        // Don't delete automatically, wait for confirmation
        return;
      } else {
        handleUseCard(card);
      }
    } else {
      if (swipeDirection === 'normal') {
        handleUseCard(card);
      } else {
        // Don't delete automatically, wait for confirmation
        return;
      }
    }
  };

  const renderCard = (card: AppCard, index: number) => {
    const progress = (card.timeUsed / card.timeLimit) * 100;
    const progressColor = progress >= 90 ? '#FF4444' : '#4CAF50';

    if (!cardAnimations.current[card.id]) {
      cardAnimations.current[card.id] = new Animated.Value(0);
    }

    if (!pressAnimations.current[card.id]) {
      pressAnimations.current[card.id] = new Animated.Value(0);
    }

    const jiggleAnimation = pressAnimations.current[card.id].interpolate({
      inputRange: [0, 0.25, 0.5, 0.75, 1],
      outputRange: ['0deg', '-5deg', '0deg', '5deg', '0deg'],
    });

    const isSelected = selectedCard === card.id;

    return (
      <Swipeable
        ref={(ref) => {
          swipeableRefs.current[card.id] = ref;
        }}
        renderRightActions={(progress, dragX) => 
          swipeDirection === 'normal' 
            ? renderRightActions(progress, dragX, card)
            : renderLeftActions(progress, dragX, card)
        }
        renderLeftActions={(progress, dragX) => 
          swipeDirection === 'normal'
            ? renderLeftActions(progress, dragX, card)
            : renderRightActions(progress, dragX, card)
        }
        onSwipeableOpen={(direction) => handleSwipeableOpen(direction, card)}
        friction={2}
        rightThreshold={80}
        leftThreshold={80}
        overshootRight={false}
        overshootLeft={false}
      >
        <Animated.View 
          style={{ 
            transform: [
              { rotate: jiggleAnimation }
            ],
            opacity: 1,
            zIndex: isSelected ? 1 : 0,
          }}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => handleCardPress(card.id)}
          >
            <Card
              style={[
                styles.appCard,
                { backgroundColor: card.color },
              ]}
            >
              <Card.Content style={styles.cardContent}>
                <View style={styles.cardHeader}>
                  <View style={styles.appInfo}>
                    {card.logo ? (
                      <Image 
                        source={{ uri: card.logo }} 
                        style={styles.appLogo}
                        resizeMode="contain"
                      />
                    ) : (
                      <MaterialCommunityIcons 
                        name={card.icon as any} 
                        size={24} 
                        color="white" 
                      />
                    )}
                    <Text style={styles.appName}>{card.name}</Text>
                  </View>
                  <View style={styles.progressContainer}>
                    <View style={styles.progressBar}>
                      <View
                        style={[
                          styles.progressFill,
                          { 
                            width: `${progress}%`,
                            backgroundColor: progressColor,
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.timeLeftText}>
                      {formatTimeLeft(card.timeUsed, card.timeLimit, card.timePeriod)}
                    </Text>
                  </View>
                </View>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        </Animated.View>
      </Swipeable>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={true}
          bounces={true}
        >
          {categories.map((category) => (
            <Surface key={category.id} style={styles.categoryContainer} elevation={2}>
              <Text style={styles.categoryTitle}>{category.name}</Text>
              <View style={styles.cardsContainer}>
                {category.cards.map((card, index) => (
                  <View key={card.id} style={styles.cardWrapper}>
                    {renderCard(card, index)}
                  </View>
                ))}
              </View>
            </Surface>
          ))}
        </ScrollView>

        <FAB
          icon="plus"
          style={[
            styles.fab,
            fabPosition === 'left' ? styles.fabLeft : styles.fabRight
          ]}
          onPress={() => navigation.navigate('AddApp')}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 16,
    paddingBottom: 80,
  },
  categoryContainer: {
    marginBottom: 24,
    borderRadius: 16,
    backgroundColor: 'white',
    overflow: 'hidden',
  },
  categoryTitle: {
    fontSize: 24,
    fontWeight: '800',
    padding: 16,
    color: '#333',
    letterSpacing: 0.5,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  cardsContainer: {
    padding: 16,
  },
  cardWrapper: {
    marginBottom: -85, // Reduced overlap to show more of each card
  },
  appCard: {
    borderRadius: 20,
    elevation: 4,
    height: 200,
  },
  cardContent: {
    padding: 32,
    height: '100%',
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  appInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginLeft: 16, // Added left margin
  },
  appLogo: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'white',
  },
  appName: {
    color: 'white',
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  progressContainer: {
    flex: 1,
    marginLeft: 32,
    marginRight: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  timeLeftText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'right',
    opacity: 0.9,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    gap: 8,
  },
  actionButton: {
    flex: 1,
  },
  deleteButton: {
    borderColor: '#FF4444',
  },
  fab: {
    position: 'absolute',
    bottom: 16,
  },
  fabLeft: {
    left: 32,
  },
  fabRight: {
    right: 32,
  },
  rightActionsContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FF4444',
    borderRadius: 20,
    overflow: 'hidden',
  },
  leftActionsContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 20,
    overflow: 'hidden',
  },
  rightActions: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: '12%',
  },
  leftActions: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: '12%',
  },
  useButton: {
    backgroundColor: '#4CAF50',
  },
  actionIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  airplaneIcon: {
    position: 'absolute',
    top: -10,
    right: -10,
    transform: [{ rotate: '45deg' }],
  },
  confirmationButtons: {
    position: 'absolute',
    right: 16,
    flexDirection: 'row',
    gap: 16,
    marginTop: 60,
  },
  confirmationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  confirmButton: {
    backgroundColor: 'rgba(76, 175, 80, 0.9)',
  },
  cancelButton: {
    backgroundColor: 'rgba(255, 68, 68, 0.9)',
  },
  progressText: {
    color: '#666',
    fontSize: 12,
    marginTop: 4,
  },
  appIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
});

export default PersonalScreen; 