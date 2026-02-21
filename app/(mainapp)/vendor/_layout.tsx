import { Tabs } from 'expo-router';
import {
    LayoutDashboard,
    Package,
    ClipboardList,
    Radio,
    BarChart3,
    Wallet,
    User,
} from 'lucide-react-native';
import { colors } from '@/constants/colors';

export default function VendorLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.textSecondary,
                tabBarStyle: {
                    backgroundColor: colors.white,
                    borderTopWidth: 1,
                    borderTopColor: colors.borderLight,
                    paddingTop: 8,
                    paddingBottom: 8,
                    height: 64,
                },
                tabBarLabelStyle: {
                    fontSize: 10,
                    fontWeight: '500',
                },
            }}
        >
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="index"
                options={{
                    href: null,
                    title: 'Dashboard',
                    tabBarIcon: ({ color, size }) => <LayoutDashboard size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="products"
                options={{
                    title: 'Products',
                    tabBarIcon: ({ color, size }) => <Package size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="orders"
                options={{
                    title: 'Orders',
                    tabBarIcon: ({ color, size }) => <ClipboardList size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="live"
                options={{
                    title: 'Live',
                    tabBarIcon: ({ color, size }) => <Radio size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="analytics"
                options={{
                    href: null,
                    title: 'Analytics',
                    tabBarIcon: ({ color, size }) => <BarChart3 size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="earnings"
                options={{
                    href: null,
                    title: 'Earnings',
                    tabBarIcon: ({ color, size }) => <Wallet size={size} color={color} />,
                }}
            />
        </Tabs>
    );
}
