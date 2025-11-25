import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Head, useForm } from '@inertiajs/react';
import { Key, Loader2 } from 'lucide-react';

interface LoginProps {
    errors?: {
        api_key?: string;
    };
}

export default function VendorPortalLogin({ errors }: LoginProps) {
    const { data, setData, post, processing } = useForm({
        api_key: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/vendor-portal/authenticate');
    };

    return (
        <>
            <Head title="Vendor Portal - Login" />
            <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                            <Key className="h-6 w-6 text-blue-600" />
                        </div>
                        <CardTitle className="text-2xl">Vendor Portal</CardTitle>
                        <CardDescription>
                            Enter your API key to access your purchase orders
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="api_key">API Key</Label>
                                <Input
                                    id="api_key"
                                    type="password"
                                    placeholder="vak_xxxxxxxxxxxxxxxx"
                                    value={data.api_key}
                                    onChange={(e) => setData('api_key', e.target.value)}
                                    required
                                    autoFocus
                                />
                                {errors?.api_key && (
                                    <p className="text-sm text-red-600">{errors.api_key}</p>
                                )}
                            </div>
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={processing}
                            >
                                {processing ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Authenticating...
                                    </>
                                ) : (
                                    'Access Portal'
                                )}
                            </Button>
                        </form>
                        <div className="mt-6 text-center text-sm text-gray-500">
                            <p>
                                Don&apos;t have an API key? Contact your customer to
                                request access.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
