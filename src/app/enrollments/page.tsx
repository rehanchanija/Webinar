"use client";

import { useStore, EnrollmentStatus } from "@/lib/store";
import { StatusBadge } from "@/components/StatusBadge";
import { formatDate } from "@/lib/utils";
import { Modal } from "@/components/Modal";
import {
  Calendar,
  Video,
  Mail,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  BookOpen,
  Award,
  Download,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EnrollmentsPage() {
  const router = useRouter();
  const {
    user,
    enrollments,
    webinars,
    setEnrollmentStatus,
    markWebinarCompleted,
  } = useStore();
  const [toast, setToast] = useState<string | null>(null);
  const [selectedCertificate, setSelectedCertificate] = useState<any>(null);

  useEffect(() => {
    if (!user) {
      router.replace("/login");
    }
  }, [user, router]);

  const userEnrollments = enrollments.filter((e) => e.userId === user?.id);

  const getWebinar = (id: string) => webinars.find((w) => w.id === id);

  const handleSimulateAction = (
    enrollmentId: string,
    status: EnrollmentStatus,
  ) => {
    setEnrollmentStatus(enrollmentId, status);
    if (status === "approved") {
      setToast(
        "Success! Your enrollment was approved. Webinar link sent to your email.",
      );
      setTimeout(() => setToast(null), 5000);
    }
  };

  const handleJoinWebinar = (webinarId: string) => {
    setToast("Webinar joined! Simulating completion...");
    setTimeout(() => {
      markWebinarCompleted(webinarId);
      setToast("Webinar completed! You can now download your certificate.");
      setTimeout(() => setToast(null), 3000);
    }, 1500);
  };

  const downloadPDF = async () => {
    const element = document.getElementById("certificate-content");
    if (!element) return;
    try {
      setToast("Generating PDF...");
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");

      const canvas = await html2canvas(element, { 
        scale: 3, // Higher scale for better quality
        useCORS: true,
        logging: false,
        backgroundColor: null
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("landscape", "px", [canvas.width / 3, canvas.height / 3]);

      pdf.addImage(imgData, "PNG", 0, 0, canvas.width / 3, canvas.height / 3);
      pdf.save(`${user?.name}_Certificate.pdf`);

      setToast("Certificate downloaded successfully!");
      setTimeout(() => {
        setToast(null);
        setSelectedCertificate(null);
      }, 3000);
    } catch (err) {
      setToast("Failed to generate PDF");
      setTimeout(() => setToast(null), 3000);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-4 bg-green-600 text-white rounded-2xl shadow-2xl shadow-green-600/30"
          >
            <Mail size={20} />
            <span className="font-bold">{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
            My Enrollments
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg">
            Manage your registered sessions and join live events.
          </p>
        </div>

        <div className="flex items-center gap-3 px-4 py-2 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl border border-blue-100 dark:border-blue-500/20">
          <Clock size={18} />
          <span className="text-sm font-bold">
            {userEnrollments.length} Active Requests
          </span>
        </div>
      </div>

      <div className="space-y-6">
        {userEnrollments.length > 0 ? (
          userEnrollments.map((enrollment, index) => {
            const webinar = getWebinar(enrollment.webinarId);
            if (!webinar) return null;

            return (
              <motion.div
                key={enrollment.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative overflow-hidden bg-white dark:bg-slate-950 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all p-4 sm:p-6"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="relative w-full md:w-32 h-20 rounded-2xl overflow-hidden shrink-0 border border-slate-100 dark:border-slate-800">
                    <Image
                      src={webinar.thumbnail}
                      alt={webinar.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <StatusBadge type={enrollment.status} />
                      <span className="text-slate-300 dark:text-slate-700">
                        |
                      </span>
                      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
                        <Calendar size={14} className="text-blue-500" />
                        {formatDate(webinar.date)}
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1 truncate">
                      {webinar.title}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm italic mb-4">
                      Enrollment ID: #{enrollment.id}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 mt-4">
                      {enrollment.status === "approved" ? (
                        webinar.status === "completed" ? (
                          <button
                            onClick={() => setSelectedCertificate(webinar)}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold transition-all shadow-lg shadow-purple-500/20 active:scale-95 text-sm"
                          >
                            <Award size={18} />
                            View Certificate
                          </button>
                        ) : (
                          <button
                            onClick={() => handleJoinWebinar(webinar.id)}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95 text-sm"
                          >
                            <Video size={18} />
                            Join Webinar
                          </button>
                        )
                      ) : (
                        <button
                          disabled
                          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 font-bold border border-slate-200 dark:border-slate-700 cursor-not-allowed text-sm"
                        >
                          <Video size={18} />
                          Join Webinar
                        </button>
                      )}

                      {/* Simulation Controls - For Demo ONLY */}
                      {enrollment.status === "pending" && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              handleSimulateAction(enrollment.id, "approved")
                            }
                            className="p-2 py-2.5 rounded-xl bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-500/20 transition-all font-bold text-sm px-4 flex items-center gap-2 border border-green-200 dark:border-green-500/20"
                            title="Simulate Approval"
                          >
                            <CheckCircle2 size={16} />
                            Self-Approve
                          </button>
                          <button
                            onClick={() =>
                              handleSimulateAction(enrollment.id, "rejected")
                            }
                            className="p-2 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-all font-bold text-sm px-4 flex items-center gap-2 border border-rose-200 dark:border-rose-500/20"
                            title="Simulate Rejection"
                          >
                            <XCircle size={16} />
                            Reject
                          </button>
                        </div>
                      )}

                      {enrollment.status === "rejected" && (
                        <button
                          onClick={() =>
                            handleSimulateAction(enrollment.id, "pending")
                          }
                          className="px-4 py-2.5 rounded-xl text-slate-500 hover:text-blue-500 transition-colors font-bold text-sm flex items-center gap-2"
                        >
                          <Trash2 size={16} />
                          Retry Request
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center glass rounded-[40px] px-10">
            <div className="bg-slate-100 dark:bg-slate-800 p-8 rounded-full mb-6">
              <BookOpen
                size={48}
                className="text-slate-300 dark:text-slate-600"
              />
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
              No enrollments yet
            </h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-8">
              Explore our catalogue and register for sessions you find
              interesting.
            </p>
            <Link
              href="/dashboard"
              className="px-8 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-xl shadow-blue-600/20"
            >
              Browse Catalog
            </Link>
          </div>
        )}
      </div>

      <Modal
        isOpen={!!selectedCertificate}
        onClose={() => setSelectedCertificate(null)}
        title="Certificate of Completion"
        maxWidth="xl"
      >
        <div className="relative w-full">
          <button
            onClick={downloadPDF}
            className="absolute top-4 right-4 z-20 p-3 bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-xl rounded-full transition-all active:scale-95 border border-slate-200 dark:border-slate-700"
            title="Download PDF"
            data-html2canvas-ignore="true"
          >
            <Download size={20} />
          </button>

          <div className="w-full overflow-x-auto pb-4 scrollbar-hide flex justify-center">
            <div
              id="certificate-content"
              className="flex flex-col items-center justify-center p-8 md:p-10 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border-[8px] border-double border-slate-200 dark:border-slate-700 rounded-[24px] relative overflow-hidden w-[800px] min-h-[500px] shrink-0 shadow-2xl"
            >
            <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl" />

            <Award size={64} className="text-yellow-500 mb-5 drop-shadow-md" />
            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-widest text-center mb-3">
              Certificate of Completion
            </h2>

            <div className="text-slate-500 dark:text-slate-400 text-center space-y-2 mb-6 max-w-lg mx-auto leading-relaxed text-[11px] md:text-xs">
              <p className="italic">This acknowledges that</p>
            </div>

            <p className="text-2xl md:text-3xl font-serif font-bold text-slate-800 dark:text-slate-200 mb-6 border-b border-slate-300 dark:border-slate-600 pb-3 px-10 text-center w-full max-w-xl">
              {user.name}
            </p>

            <div className="text-slate-500 dark:text-slate-400 text-center space-y-3 mb-6 max-w-xl mx-auto leading-relaxed text-[11px] md:text-xs">
              <p>
                has successfully fulfilled all requirements and demonstrated
                exceptional commitment by completing the comprehensive training
                curriculum for the course:
              </p>
            </div>

            <p className="text-lg md:text-xl font-bold text-slate-900 dark:text-white text-center mb-4 max-w-lg">
              {selectedCertificate?.title}
            </p>

            <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center italic max-w-xl mb-8 leading-relaxed px-4">
              This certificate verifies the acquisition of specialized skills
              and knowledge through rigorous participation in the detailed
              webinar sessions, covering essential industry practices and
              advanced methodologies.
            </p>
            <div className="flex gap-5 text-xs text-slate-600 dark:text-slate-300 mb-8 bg-white/50 dark:bg-slate-950/50 px-6 py-2 rounded-full border border-slate-200 dark:border-slate-700">
              <span className="flex items-center gap-1.5">
                <strong className="text-slate-900 dark:text-white">
                  Instructor:
                </strong>
                {selectedCertificate?.instructor}
              </span>
              <span className="text-slate-300 dark:text-slate-700">|</span>
              <span className="flex items-center gap-1.5">
                <strong className="text-slate-900 dark:text-white">
                  Duration:
                </strong>
                {selectedCertificate?.duration}
              </span>
            </div>

            <div className="flex justify-between w-full mt-auto text-[10px] md:text-xs text-slate-500 dark:text-slate-400 font-bold border-t border-slate-200 dark:border-slate-700 pt-5 px-4 mb-2">
              <div className="flex flex-col items-center">
                <span>{new Date().toLocaleDateString()}</span>
                <span className="text-xs uppercase opacity-70 border-t border-slate-300 dark:border-slate-600 mt-1 pt-1">
                  Date
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-serif italic text-xl leading-none">
                  Streamly
                </span>
                <span className="text-xs uppercase opacity-70 border-t border-slate-300 dark:border-slate-600 mt-1 pt-1">
                  Platform
                </span>
              </div>
            </div>
          </div>
        </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={() => setSelectedCertificate(null)}
            className="px-6 py-2.5 rounded-xl font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Close
          </button>
          <button
            onClick={downloadPDF}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-95 flex items-center gap-2"
          >
            <Download size={18} />
            Download PDF
          </button>
        </div>
      </Modal>
    </div>
  );
}
