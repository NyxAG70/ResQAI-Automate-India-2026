import React from 'react';
import { useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { 
  useCreateIncident, 
  getGetDashboardQueryKey, 
  getListIncidentsQueryKey,
  DisasterType
} from '@workspace/api-client-react';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { PlusSquare, AlertTriangle, ArrowLeft } from 'lucide-react';
import {
  reportFormSchema,
  type ReportFormValues,
} from './report-schema';

export default function Report() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const createIncident = useCreateIncident();

  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportFormSchema as any),
    defaultValues: {
      reporterName: '',
      description: '',
      disasterType: DisasterType.other,
      locationDescription: '',
      latitude: 28.6139,
      longitude: 77.209,
      peopleAffected: 0,
    },
  });

  const onSubmit = (values: ReportFormValues) => {
    createIncident.mutate(
      {
        data: {
          ...values,
        }
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetDashboardQueryKey() });
          queryClient.invalidateQueries({ queryKey: getListIncidentsQueryKey() });
          
          toast({
            title: "Report Submitted",
            description: "The incident has been scored by the deterministic triage engine.",
          });
          
          setLocation('/');
        },
        onError: () => {
          toast({
            title: "Submission Failed",
            description: "Unable to submit report to central command. Try again.",
            variant: "destructive"
          });
        }
      }
    );
  };

  return (
    <div className="min-h-full flex flex-col md:items-center py-6 px-4 md:px-0">
      <div className="w-full max-w-2xl bg-card border border-border rounded-md shadow-lg overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="p-6 border-b border-border bg-secondary/30 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-sm text-primary">
              <PlusSquare className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold font-mono-ui">INCIDENT_INTAKE</h1>
              <p className="text-xs text-muted-foreground uppercase tracking-widest">Field Report Submission</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setLocation('/')}
            className="text-muted-foreground hover:text-foreground font-mono-ui text-xs"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> CANCEL
          </Button>
        </div>

        <div className="p-6 bg-background">
          <div className="mb-6 p-4 border border-destructive/30 bg-destructive/5 rounded-sm flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              <strong className="text-foreground">NOTICE:</strong> Reports are prioritized by a transparent deterministic triage engine. Ensure location details are as accurate as possible to facilitate rapid response deployment.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="reporterName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-mono-ui text-xs text-muted-foreground uppercase">Reporter ID / Name (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Unit 42 or Citizen Name" className="bg-secondary/20" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="disasterType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-mono-ui text-xs text-muted-foreground uppercase">Incident Class</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-secondary/20 capitalize">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(DisasterType).map((type) => (
                            <SelectItem key={type} value={type} className="capitalize">
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="locationDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-mono-ui text-xs text-muted-foreground uppercase">Location Coordinates / Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Intersection, landmark, or address" className="bg-secondary/20" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="latitude"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel className="font-mono-ui text-xs text-muted-foreground uppercase">Latitude</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="any"
                          min={-90}
                          max={90}
                          className="bg-secondary/20 font-mono-ui"
                          {...field}
                        />
                      </FormControl>
                      {fieldState.error && (
                        <p
                          className="text-[0.8rem] font-medium text-destructive"
                          role="alert"
                        >
                          {fieldState.error.message}
                        </p>
                      )}
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="longitude"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel className="font-mono-ui text-xs text-muted-foreground uppercase">Longitude</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="any"
                          min={-180}
                          max={180}
                          className="bg-secondary/20 font-mono-ui"
                          {...field}
                        />
                      </FormControl>
                      {fieldState.error && (
                        <p
                          className="text-[0.8rem] font-medium text-destructive"
                          role="alert"
                        >
                          {fieldState.error.message}
                        </p>
                      )}
                    </FormItem>
                  )}
                />
              </div>
              <p className="text-xs text-muted-foreground -mt-2">
                GIS placement uses these submitted coordinates. The visible defaults identify the ResQAI Delhi demo zone; update them for the reported location.
              </p>

              <FormField
                control={form.control}
                name="peopleAffected"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-mono-ui text-xs text-muted-foreground uppercase">Estimated Population Affected</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} className="bg-secondary/20 font-mono-ui" {...field} />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Number of individuals requiring immediate assistance or extraction.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-mono-ui text-xs text-muted-foreground uppercase">Operational Details</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Provide detailed situational awareness..." 
                        className="min-h-[120px] bg-secondary/20 resize-none" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="pt-4 border-t border-border flex justify-end">
                <Button 
                  type="submit" 
                  disabled={createIncident.isPending}
                  className="font-mono-ui w-full md:w-auto min-w-[200px]"
                >
                  {createIncident.isPending ? "TRANSMITTING..." : "SUBMIT_REPORT"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
